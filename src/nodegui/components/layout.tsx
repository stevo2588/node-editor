import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, View, Button, useEventHandler } from "@nodegui/react-nodegui";
import { QPushButtonSignals, QWidgetSignals, QMouseEvent, WidgetEventTypes, WidgetAttribute, QDrag, NativeElement, QMimeData, DropAction, QDragEnterEvent, QDragMoveEvent, QDropEvent, QPoint, MouseButton } from "@nodegui/nodegui";
import open from "open";
import Link from "./Link";


// TODO: FUTURE -- use canvas or maybe QtGraphicsView for better performance

const NodePortOld = ({ label, input, onPress, onRelease }: { label: string, input: boolean, onPress: () => void, onRelease: () => void }) => {
  // const [enabled, setEnabled] = useState(true);
  const portRef = useRef(null);

  const handler = useEventHandler<QWidgetSignals>({
    MouseButtonPress: async (native?: NativeElement) => {
      console.log('port press!');
      onPress(); // TODO: pass in offset from center
      const data = new QMimeData();
      data.setText('hello');
      // @ts-ignore
      const drag = new QDrag(portRef.current);
      drag.setMimeData(data);
      // something wrong with this?
      await drag.exec(DropAction.CopyAction);
      // setEnabled(false);
    },
    // MouseMove: (nativeEvt: any) => {
    //   const mouseEvt = new QMouseEvent(nativeEvt);
    //   console.log(label);
    // },
    MouseButtonRelease: () => {
      console.log('port release!');
      console.log(label);
      onRelease();
    },
    DragEnter: (nativeEvt: any) => {
      const dragEvt = new QDragEnterEvent(nativeEvt);
      console.log('drag enter!');
      if (dragEvt.source().objectName() === portRef.current.objectName()) {
        console.log('equals this');
        dragEvt.setDropAction(DropAction.CopyAction);
        dragEvt.accept();
      } else {
        console.log('accept action');
        dragEvt.acceptProposedAction();
      }
    },
    DragMove: (nativeEvt: any) => {
      const dragEvt = new QDragMoveEvent(nativeEvt);
      console.log('drag move!');
      if (dragEvt.source().objectName() === portRef.current.objectName()) {
        console.log('equals this');
        dragEvt.setDropAction(DropAction.CopyAction);
        dragEvt.accept();
      } else {
        console.log('accept action');
        dragEvt.acceptProposedAction();
      }
    },
    // DragLeave: () => {
    //   console.log('drag leave!');
    // },
    Drop: (nativeEvt: any) => {
      const dragEvt = new QDropEvent(nativeEvt);
      console.log('drop');
      if (dragEvt.source().objectName() === portRef.current.objectName()) {
        console.log('equals this');
        dragEvt.setDropAction(DropAction.CopyAction);
        dragEvt.accept();
      } else {
        console.log('accept action');
        dragEvt.acceptProposedAction();
        onRelease();
      }
    },
  }, [onPress, onRelease]);
  // }, []);

  // const port = <Button style={Port} mouseTracking attributes={{ [WidgetAttribute.WA_AcceptDrops]: true }} on={handler} />;
  // const port = <View style={Port} />;
  const port = <View ref={portRef} style={Port} attributes={{ [WidgetAttribute.WA_AcceptDrops]: true }} on={handler} />;
  const lbl = <Text style={Label}>{label}</Text>;

  return (
    <View style={PortLabel}>
      {input ? port : lbl}
      {input ? lbl : port}
    </View>
  );
}

const NodePort = React.memo(({ label, input, onPress, onRelease, onDrop, onRightClick, mouseState, dragPayload }: {
  label: string,
  input: boolean,
  onPress: (offset: { x: number; y: number }) => void,
  onRelease: (pos: { x: number; y: number }) => void,
  onDrop: (payload: any) => void,
  onRightClick?: () => void,
  mouseState: { isDown: boolean, globalPos: { x: number, y: number } };
  dragPayload: any;
}) => {
  const portEl = useRef();
  const prevMouseState = useRef<typeof mouseState>();

  useEffect(() => {
    if (prevMouseState.current?.isDown && !mouseState.isDown) {
      const pos = portEl.current.mapFromGlobal(new QPoint(mouseState.globalPos.x, mouseState.globalPos.y));
      if (pos.x() > 0 && pos.x() < 20 && pos.y() > 0 && pos.y() < 20) {
        onDrop(dragPayload);
      }
    }

    prevMouseState.current = mouseState;
  }, [mouseState])

  const handler = useEventHandler<QWidgetSignals>({
    MouseButtonPress: (nativeEvt: any) => {
      // const globalPos = portEl.current.mapToGlobal(new QPoint(portEl.current.pos().x, portEl.current.pos().y));
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;
      else onPress({ x: 0, y: 0 }); // TODO: pass in offset from center
    },
    MouseButtonRelease: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (onRightClick && mouseEvt.button() === MouseButton.RightButton) onRightClick();
      onRelease({ x: mouseEvt.globalX(), y: mouseEvt.globalY() });
    },
  }, [onPress, onRelease]);

  const port = <View style={Port} on={handler} ref={portEl} />;
  const lbl = <Text style={Label}>{label}</Text>;

  return (
    <View style={PortLabel}>
      {input ? port : lbl}
      {input ? lbl : port}
    </View>
  );
});

const Draggable = React.memo(({ id, position, inputs, outputs, disableDrag, onDrag, onEndDrag, onPortPress, onPortRelease, onLink, onUnlink, onResize, mouseState, dragPayload }: {
  id: string;
  position: { x: number; y: number };
  inputs: { index: number }[];
  outputs: { index: number }[];
  disableDrag: boolean;
  onDrag: () => void;
  onEndDrag: () => void;
  onPortPress: (payload?: any, offset?: { x: number, y: number }) => void;
  onPortRelease: (pos: { x: number, y: number }) => void;
  onLink: (input: { nodeId: string, portId: number }, output: { nodeId: string, portId: number }) => void;
  onUnlink: (output: { nodeId: string, portId: number }) => void;
  onResize: (width: number, height: number) => void;
  mouseState: { isDown: boolean, globalPos: { x: number, y: number } };
  dragPayload: any;
}) => {
  const draggableEl = useRef();

  const handler = useEventHandler<QWidgetSignals>({
    MouseMove: (nativeEvt: any) => {
      if (disableDrag) return;
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;
      onDrag();
    },
    MouseButtonRelease: (nativeEvt: any) => {
      if (disableDrag) return;
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;
      onEndDrag();
    },
    Resize: (nativeEvt: any) => {
      onResize(draggableEl.current.geometry().width(), draggableEl.current.geometry().height());
    },
  }, [disableDrag, onResize]);

  // useLayoutEffect(() => {
  //   console.log('Layout effect')
  //   console.log(`${draggableEl.current.geometry().width()} x ${draggableEl.current.geometry().height()}`);
  // }, []);

  return (
    <>
    {/* <View style={OuterNode + `left: ${position.x}; top: ${position.y};`} on={handler}> */}
    <View style={Node + `left: ${position.x}; top: ${position.y};`} on={handler} ref={draggableEl}>
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
          {inputs.map(p => (
            <NodePort
              key={p.index}
              input
              label="input"
              onPress={(offset) => onPortPress({ nodeId: id, portId: p.index })}
              onRelease={(pos) => onPortRelease(pos)}
              mouseState={mouseState}
              dragPayload={dragPayload}
              onDrop={(payload) => onLink({ nodeId: id, portId: p.index }, { nodeId: payload.nodeId, portId: payload.portId })}
              // onRightClick={() => onUnlink({ })}
            />
          ))}
          {/* {props.node.additionalInputs?.length ?
          <Dropdown overlay={addPortMenu(true)} trigger={['click']} placement="bottomRight">
            <Button size="small">+</Button>
          </Dropdown>
          : null} */}
        </View>
        <View style={BodyContainer}>
        </View>
        <View style={PortsContainer}>
          {outputs.map(p => (
            <NodePort
              key={p.index}
              input={false}
              label="output"
              onPress={(offset) => onPortPress({ nodeId: id, portId: p.index })}
              onRelease={(pos) => onPortRelease(pos)}
              mouseState={mouseState}
              dragPayload={dragPayload}
              onDrop={(payload) => onLink({ nodeId: payload.nodeId, portId: payload.portId }, { nodeId: id, portId: p.index })}
              onRightClick={() => onUnlink({ nodeId: id, portId: p.index })}
            />
          ))}
          {/* {props.node.additionalOutputs?.length ?
            <Dropdown overlay={addPortMenu(false)} trigger={['click']} placement="bottomLeft">
              <Button size="small">+</Button>
            </Dropdown>
          : null} */}
        </View>
      </View>
      </View>
    </View>
    {/* </View> */}
    </>
  );
});

const Canvas = ({ nodes, updateNode }: {
  nodes: { [id: string]: { x: number, y: number, inputs: any[], outputs: any[] } };
  updateNode: (id: string, data: { x: number; y: number, outputs: any[] }) => void;
}) => {
  const nodeEls = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [globalPosition, setGlobalPosition] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPress, setLastPress] = useState({ x: 0, y: 0 });
  const [portPress, setPortPress] = useState<{ x: number, y: number }|null>(null);
  const [dragPayload, setDragPayload] = useState<any>();
  const [dragging, setDragging] = useState<string|null>(null);
  const [size, setSize] = useState<{ [id: string]: { width: number; height: number }}>();

  const handler = useEventHandler<QWidgetSignals>({
    MouseMove: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;

      setPosition({ x: mouseEvt.x(), y: mouseEvt.y() });
      setGlobalPosition({ x: mouseEvt.globalX(), y: mouseEvt.globalY() });
      if (dragging) updateNode(dragging, { ...nodes[dragging], x: mouseEvt.x(), y: mouseEvt.y() });
    },
    MouseButtonPress: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;

      setMouseDown(true);
      setPosition({ x: mouseEvt.x(), y: mouseEvt.y() });
      setGlobalPosition({ x: mouseEvt.globalX(), y: mouseEvt.globalY() });
      setLastPress({ x: mouseEvt.x(), y: mouseEvt.y() });
      // setLastPress({ x: mouseEvt.globalX(), y: mouseEvt.globalY() });
    },
    MouseButtonRelease: (nativeEvt: any) => {
      const mouseEvt = new QMouseEvent(nativeEvt);
      if (mouseEvt.button() === MouseButton.RightButton) return;
      setMouseDown(false);
    },
  }, [position, portPress, lastPress, globalPosition]);

  return (
    <View style={graphStyle} on={handler}>
      {Object.keys(nodes).map((k) =>
        <Draggable
          id={k}
          key={k}
          position={{ x: nodes[k].x, y: nodes[k].y }}
          inputs={nodes[k].inputs}
          outputs={nodes[k].outputs}
          disableDrag={!!portPress}
          onDrag={() => setDragging(k)}
          onEndDrag={() => setDragging(null)}
          onPortPress={(payload, offset) => {
            setPortPress({ x: globalPosition.x, y: globalPosition.y });
            setDragPayload(payload);
          }}
          onPortRelease={(pos) => {
            setMouseDown(false);
            setGlobalPosition({ x: pos.x, y: pos.y });
            setPortPress(null);
            setDragPayload(null);
          }}
          onLink={(input: { nodeId: string, portId: number }, output: { nodeId: string, portId: number }) => {
            const obj = {
              ...nodes[output.nodeId],
              outputs: nodes[output.nodeId].outputs,
            };
            obj.outputs[output.portId] = { index: output.portId, link: { nodeId: input.nodeId, inputIndex: input.portId } };
            updateNode(output.nodeId, obj);
          }}
          onUnlink={(output: { nodeId: string, portId: number }) => {
            const obj = {
              ...nodes[output.nodeId],
              outputs: nodes[output.nodeId].outputs,
            };
            obj.outputs[output.portId] = { index: output.portId };
            updateNode(output.nodeId, obj);
          }}
          onResize={(width, height) => setSize({ ...size, [k]: { width, height } })}
          mouseState={{ isDown: mouseDown, globalPos: { x: globalPosition.x, y: globalPosition.y } }}
          dragPayload={dragPayload}
        />
      )}
      {Object.keys(nodes).map((k) => (
        nodes[k].outputs.map((p, i) => (
          (p.link && size && size[k]) ? (
            <Link
              key={`${k}-${i}`}
              start={{ x: nodes[k].x + size[k].width - 15, y: nodes[k].y + 77 + (i * 27) }}
              end={{ x: nodes[p.link.nodeId].x + 15, y: nodes[p.link.nodeId].y + 77 + (p.link.inputIndex * 27) }}
              // onRightClick={() => {
              //   const obj = {
              //     ...nodes[k],
              //     outputs: nodes[k].outputs,
              //   };
              //   obj.outputs[i] = { index: i };
              //   updateNode(k, obj);
              // }}
            />
          ) : null)
      ))).reduce((a, b) => [...a, ...b], [])}
      {portPress && <Link start={lastPress} end={position} />}
    </View>
  );
}

export const Layout = () => {
  const btnHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => open("https://creativelogic.me").catch(console.log)
    },
    []
  );

  const [nodes, setNodes] = useState({
    '1': { x: 20, y: 10, inputs: [{ index: 0 }], outputs: [{ index: 0 }, { index: 1, link: { nodeId: 2, inputIndex: 1 } }] },
    '2': { x: 300, y: 200, inputs: [{ index: 0 }, { index: 1 }], outputs: [{ index: 0, link: { nodeId: 3, inputIndex: 2 } }] },
    '3': { x: 700, y: 500, inputs: [{ index: 0 }, { index: 1 }, { index: 2 }], outputs: [{}] },
  });

  return (
    <View style={containerStyle}>
      <View style={headerStyle}><Text style={textStyle}>{`<h1>Node Editor</h1>`}</Text></View>
      <View style={editorStyle}>
        <Canvas nodes={nodes} updateNode={(id: string, data: { x: number; y: number }) => setNodes({ ...nodes, [id]: data })} />
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
  height: 20px;
  margin: 3px 3px;
  border-radius: 6px;
  background-color: rgb(255, 128, 128);
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

const OuterNode = `
  position: absolute;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
`;

  // justify-items: center;
const Title = `
  background: rgba(0, 0, 0, 0.3);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  white-space: nowrap;
  margin: 5px;
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
