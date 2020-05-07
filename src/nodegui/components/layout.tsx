import React, { useState } from "react";
import { Text, View, Button, useEventHandler } from "@nodegui/react-nodegui";
import { QPushButtonSignals, QWidgetSignals, QMouseEvent } from "@nodegui/nodegui";
import open from "open";
import Link from "./Link";


const NodePort = ({ label, input, onPress, onRelease }: { label: string, input: boolean, onPress: () => void, onRelease: () => void }) => {
  const handler = useEventHandler<QPushButtonSignals>({
    MouseButtonPress: () => {
      console.log('port press!');
      onPress();
    },
    MouseMove: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
    },
    MouseButtonRelease: () => {
      console.log('port release!');
      onRelease();
    },
  }, []);

  const port = <Button style={Port} on={handler} />;
  const lbl = <Text style={Label}>{label}</Text>;

  return (
    <View style={PortLabel}>
      {input ? port : lbl}
      {input ? lbl : port}
    </View>
  );
}

const Draggable = ({ onDrag }: { onDrag: (setPos: (pos: { x: number; y: number; }) => void) => void }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [portDragPosition, setPortDragPosition] = useState({ x: 0, y: 0 });
  const [portPressed, setPortPressed] = useState(false);
  const [lastPress, setLastPress] = useState({ x: 0, y: 0 });

  const handler = useEventHandler<QWidgetSignals>({
    MouseMove: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      console.log("mouseMoved at: ", { x: mouseEvt.x(), y: mouseEvt.y() });
      if (!portPressed) onDrag((pos) => setPosition(pos));
      else onDrag((pos) => setPortDragPosition(pos));
    },
    MouseButtonPress: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      setLastPress({ x: mouseEvt.x(), y: mouseEvt.y() });
    }
  }, [position, portPressed]);

  return (
    <>
    <View style={Node + `left: ${position.x}; top: ${position.y};`} on={handler}>
      <View style={'border-width: 4px; border-style: solid; border-color: "#1cd"; border-radius: 10px;'}>
      <View style={Title}>
        <Text style={TitleName}>Name</Text>
        {/* {props.node.graph ? <Config
          onClick={() => {
            // @ts-ignore
            props.engine.fireEvent({ nav: { path: props.node.graph.path } }, 'navigateToDiagram')
          }}
        >
          &#x2315;
        </Config>
        : null} */}
      </View>
      <View style={Content}>
        <View style={PortsContainer}>
          {/* {props.node.getInPorts().map((port: any) => <NodePort left engine={props.engine} port={port} key={port.getID()} />)} */}
          <NodePort input label="input" onPress={() => setPortPressed(true)} onRelease={() => setPortPressed(false)} />
          <NodePort input label="input" onPress={() => setPortPressed(true)} onRelease={() => setPortPressed(false)} />
          <NodePort input label="input" onPress={() => setPortPressed(true)} onRelease={() => setPortPressed(false)} />
          {/* {props.node.additionalInputs?.length ?
          <Dropdown overlay={addPortMenu(true)} trigger={['click']} placement="bottomRight">
            <Button size="small">+</Button>
          </Dropdown>
          : null} */}
        </View>
        <View style={BodyContainer}>
        </View>
        <View style={PortsContainer}>
          {/* {props.node.getOutPorts().map((port: any) => <NodePort left={false} engine={props.engine} port={port} key={port.getID()} />)} */}
          <NodePort input={false} label="output" onPress={() => setPortPressed(true)} onRelease={() => setPortPressed(false)} />
          <NodePort input={false} label="output" onPress={() => setPortPressed(true)} onRelease={() => setPortPressed(false)} />
          {/* {props.node.additionalOutputs?.length ?
            <Dropdown overlay={addPortMenu(false)} trigger={['click']} placement="bottomLeft">
              <Button size="small">+</Button>
            </Dropdown>
          : null} */}
        </View>
      </View>
      </View>
    </View>
    </>
  );
};

const Canvas = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastPress, setLastPress] = useState({ x: 0, y: 0 });

  const handler = useEventHandler<QWidgetSignals>({
    MouseMove: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      setPosition({ x: mouseEvt.x() < 0 ? 0 : mouseEvt.x(), y: mouseEvt.y() < 0 ? 0 : mouseEvt.y() });
    },
    MouseButtonPress: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      setLastPress({ x: mouseEvt.x(), y: mouseEvt.y() });
    }
  }, [position]);


  return (
    <View style={graphStyle} on={handler}>
      <Draggable onDrag={(setPos) => setPos({ x: position.x, y: position.y })} />
      <Draggable onDrag={(setPos) => setPos({ x: position.x, y: position.y })} />
      <Draggable onDrag={(setPos) => setPos({ x: position.x, y: position.y })} />
      <Link start={lastPress} end={position} />
    </View>
  );
}

export const Layout = () => {
  console.log('render layout')
  const btnHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => open("https://creativelogic.me").catch(console.log)
    },
    []
  );

  return (
    <View style={containerStyle}>
      <View style={headerStyle}><Text style={textStyle}>{`<h1>Node Editor<h1>`}</Text></View>
      <View style={editorStyle}>
        <Canvas />
        <View style={sideBarStyle}>
          <Text style={textStyle} wordWrap={true}>
            {`
              <h2>Name</h2>
            `}
          </Text>
          <Button
            style={btnStyle}
            on={btnHandler}
            text={`Compile Graph`}
          ></Button>
        </View>
      </View>
    </View>
  );
}

const containerStyle = `
  background-color: '#222';
  flex-grow: 1;
`;

const headerStyle = `
  padding: 10px;
`;

const editorStyle = `
  flex: 1;
  flex-direction: 'row';
`;

const graphStyle = `
  background-color: '#444';
  flex: 1;
`;

const draggableStyle = `
  position: absolute;
  width: 150px;
  height: 50px;
  background-color: '#334';
  border-radius: 10px;
`;

const sideBarStyle = `
  padding: 20px;
  background-color: '#333';
  width: 300px;
`;

const textStyle = `
  color: '#fff';
  padding-right: 20px;
`;

const btnStyle = `
  margin-top: 10px;
  padding: 10px;
`;

export const PortLabel = `
  display: flex;
  flex-direction: 'row';
  margin-top: 1px;
  align-items: 'center';
`;

export const Label = `
  color: '#fff';
  padding: 0 5px;
  flex-grow: 1;
`;

// export const Port = styled.div<{ left: boolean }>`
// margin-${p => p.left ? 'left' : 'right'}: -7px;
// float: ${p => p.left ? 'left' : 'right'};
  // &:hover {
  //   border: solid 2px rgb(192, 255, 0);
  //   background: rgb(192, 255, 0);
  // }
export const Port = `
  width: 20px;
  height: 22px;
  margin: 3px 1px;
  border-radius: 8px;
  border-style: solid;
  border-width: 2px;
  border-color: 'black';
  background-color: '#fff';
`;

// const Node = styled.div<{ background: string; selected: boolean }>`
  // background-color: ${p => p.background};
  // border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
  // box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4);
const Node = `
  position: absolute;
  font-family: sans-serif;
  color: white;
  overflow: visible;
  font-size: 11px;
  border-radius: 10px;
  border-style: solid;
  border-width: 5px;
  border-color: '#000';
  background-color: '#222';
`;

  // justify-items: center;
const Title = `
  background: rgba(0, 0, 0, 0.3);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  white-space: nowrap;
`;

const TitleName = `
  flex-grow: 1;
  padding: 5px 5px;
  color: '#fff';
`;

const Config = `
  padding: 2px 5px;
  margin: 3px 3px;
  margin-left: 8px;
  display: inline-block;
  color: white;
  background-color: transparent;
  font-size: 1em;
  border: 0px;
  border-radius: 3px;
  display: block;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: rgba(255, 255, 255, 0.1);
    color: black;
  }
`;

  // background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.28));
const Content = `
  display: flex;
  flex-direction: row;
`;

const PortsContainer = `
  display: flex;
  flex-direction: column;
`;

const BodyContainer = `
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
`;

const NodePortStyle = `
  flex-direction: column;
`;
