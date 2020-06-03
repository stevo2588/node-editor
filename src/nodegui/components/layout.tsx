import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Text, View, Button, useEventHandler, ComboBox } from "@nodegui/react-nodegui";
import { QPushButtonSignals, QWidgetSignals, QMouseEvent, WidgetEventTypes, WidgetAttribute, QDrag, NativeElement, QMimeData, DropAction, QDragEnterEvent, QDragMoveEvent, QDropEvent, QPoint, MouseButton, QComboBoxSignals, QMenu, QAction, ContextMenuPolicy } from "@nodegui/nodegui";
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
    portEl.current.setContextMenuPolicy(ContextMenuPolicy.PreventContextMenu);
  }, []);

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

  const port = <View  styleSheet={`QWidget {${Port}} QWidget::hover { background-color: blue; }`} on={handler} ref={portEl} />;
  const lbl = <Text style={Label}>{label}</Text>;

  return (
    <View style={PortLabel}>
      {input ? port : lbl}
      {input ? lbl : port}
    </View>
  );
});

const Draggable = React.memo(({ id, position, inputs, outputs, additionalInputs, additionalOutputs, disableDrag, onDrag, onEndDrag, onPortPress, onPortRelease, onLink, onUnlink, onAddPort, onResize, mouseState, dragPayload }: {
  id: string;
  position: { x: number; y: number };
  inputs: { index: number, value: string }[];
  outputs: { index: number, value: string }[];
  additionalInputs: string[];
  additionalOutputs: string[];
  disableDrag: boolean;
  onDrag: () => void;
  onEndDrag: () => void;
  onPortPress: (payload?: any, offset?: { x: number, y: number }) => void;
  onPortRelease: (pos: { x: number, y: number }) => void;
  onLink: (input: { nodeId: string, portId: number }, output: { nodeId: string, portId: number }) => void;
  onUnlink: (output: { nodeId: string, portId: number }) => void;
  onAddPort: (input: boolean, type: string) => void;
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
        <View style={PortsContainer(true)}>
          {inputs.map(p => (
            <NodePort
              key={p.index}
              input
              label={p.value}
              onPress={(offset) => onPortPress({ nodeId: id, portId: p.index })}
              onRelease={(pos) => onPortRelease(pos)}
              mouseState={mouseState}
              dragPayload={dragPayload}
              onDrop={(payload) => onLink({ nodeId: id, portId: p.index }, { nodeId: payload.nodeId, portId: payload.portId })}
              // onRightClick={() => onUnlink({ })}
            />
          ))}
          {additionalInputs.length ? (
            <ComboBox on={{currentIndexChanged: (index) => index > 0 && onAddPort(true, `input_${inputs.length}`)}} items={[{ text: '-- Select Input --' }, ...additionalInputs.map(i => ({ text: i }))]} styleSheet={ComboBoxStyle} />
          )
          : null}
        </View>
        <View style={BodyContainer}>
        </View>
        <View style={PortsContainer(false)}>
          {outputs.map(p => (
            <NodePort
              key={p.index}
              input={false}
              label={p.value}
              onPress={(offset) => onPortPress({ nodeId: id, portId: p.index })}
              onRelease={(pos) => onPortRelease(pos)}
              mouseState={mouseState}
              dragPayload={dragPayload}
              onDrop={(payload) => onLink({ nodeId: payload.nodeId, portId: payload.portId }, { nodeId: id, portId: p.index })}
              onRightClick={() => onUnlink({ nodeId: id, portId: p.index })}
            />
          ))}
          {additionalOutputs.length ? (
            <ComboBox on={{currentIndexChanged: (index) => index > 0 && onAddPort(false, `input_${outputs.length}`)}} items={[{ text: '-- Select Output--' }, ...additionalOutputs.map(i => ({ text: i }))]} styleSheet={ComboBoxStyle} />
          )
          : null}
        </View>
      </View>
      </View>
    </View>
    </>
  );
});

const Canvas = ({ nodes, updateNode, addNode }: {
  nodes: { [id: string]: {
    x: number;
    y: number;
    inputs: { index: number; value: string }[];
    outputs: { index: number; value: string; links?: { nodeId: string; inputIndex: number }[] }[]
  } };
  updateNode: (id: string, data: {
    x: number;
    y: number;
    inputs: { index: number; value: string }[];
    outputs: { index: number; value: string; links?: { nodeId: string; inputIndex: number }[] }[]
  }) => void;
  addNode: (data: {
    x: number;
    y: number;
    inputs: { index: number; value: string }[];
    outputs: { index: number; value: string; links?: { nodeId: string; inputIndex: number }[] }[]
  }) => void;
}) => {
  const canvasEl = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [globalPosition, setGlobalPosition] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPress, setLastPress] = useState({ x: 0, y: 0 });
  const [portPress, setPortPress] = useState<{ x: number, y: number }|null>(null);
  const [dragPayload, setDragPayload] = useState<any>();
  const [dragging, setDragging] = useState<string|null>(null);
  const [size, setSize] = useState<{ [id: string]: { width: number; height: number }}>();

  useEffect(() => {
    canvasEl.current.setContextMenuPolicy(ContextMenuPolicy.CustomContextMenu);
  }, []);

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
    customContextMenuRequested: (pos: { x: number, y: number }) => {
      if (!canvasEl.current) return;
      console.log(pos);
      const ctxMenu = new QMenu(canvasEl.current);
      const action = new QAction(canvasEl.current);
      action.setText('something');
      action.addEventListener('triggered', () => addNode({ x: 50, y: 50, inputs: [], outputs: [] }));
      ctxMenu.addAction(action);
      ctxMenu.exec(canvasEl.current.mapToGlobal(new QPoint(pos.x, pos.y)));
    },
  }, [position, portPress, lastPress, globalPosition]);

  return (
    <View style={graphStyle} on={handler} ref={canvasEl}>
      {Object.keys(nodes).map((k) =>
        <Draggable
          id={k}
          key={k}
          position={{ x: nodes[k].x, y: nodes[k].y }}
          inputs={nodes[k].inputs}
          outputs={nodes[k].outputs}
          additionalInputs={['test_input_01', 'test_input_02']}
          additionalOutputs={['test_output']}
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
            if (nodes[output.nodeId].outputs.find(o => 
              o.index === output.portId
              && o.links?.find(l => l.nodeId === input.nodeId && l.inputIndex === input.portId)
            )) return;

            const obj = {
              ...nodes[output.nodeId],
              outputs: nodes[output.nodeId].outputs,
            };
            obj.outputs[output.portId] = {
              ...obj.outputs[output.portId],
              index: output.portId,
              links: [...(obj.outputs[output.portId].links || []), { nodeId: input.nodeId, inputIndex: input.portId }],
            };
            updateNode(output.nodeId, obj);
          }}
          onUnlink={(output: { nodeId: string, portId: number }) => {
            const obj = {
              ...nodes[output.nodeId],
              outputs: nodes[output.nodeId].outputs,
            };
            obj.outputs[output.portId] = { index: output.portId, value: obj.outputs[output.portId].value };
            updateNode(output.nodeId, obj);
          }}
          onAddPort={(input: boolean, type: string) => {
            const obj = { ...nodes[k] };
            if (input) {
              obj.inputs.push({ index: obj.inputs.length, value: type });
            } else {
              obj.outputs.push({ index: obj.outputs.length, value: type });
            }
            updateNode(k, obj);
          }}
          onResize={(width, height) => setSize({ ...size, [k]: { width, height } })}
          mouseState={{ isDown: mouseDown, globalPos: { x: globalPosition.x, y: globalPosition.y } }}
          dragPayload={dragPayload}
        />
      )}
      {Object.keys(nodes).map((k) => (
        nodes[k].outputs.map((p, i) => (
          (p.links && size && size[k]) ? p.links.map((link: any) => (
            <Link
              key={`${k}-${i}-${link.nodeId}-${link.inputIndex}`}
              start={{ x: nodes[k].x + size[k].width - 15, y: nodes[k].y + 67 + (i * 27) }}
              end={{ x: nodes[link.nodeId].x + 15, y: nodes[link.nodeId].y + 67 + (link.inputIndex * 27) }}
            />
          )) : null)
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

  const [nodes, setNodes] = useState<{ [id: string]: {
    x: number;
    y: number;
    inputs: { index: number; value: string }[];
    outputs: { index: number; value: string; links?: { nodeId: string; inputIndex: number }[] }[];
  }}>({
    '1': { x: 20, y: 10, inputs: [{ index: 0, value: 'input_0' }], outputs: [{ index: 0, value: 'output_0' }, { index: 1, value: 'output_1', links: [{ nodeId: '2', inputIndex: 1 }] }] },
    '2': { x: 300, y: 200, inputs: [{ index: 0, value: 'input_0' }, { index: 1, value: 'input_1' }], outputs: [{ index: 0, value: 'output_0', links: [{ nodeId: '3', inputIndex: 2 }] }] },
    '3': { x: 700, y: 500, inputs: [{ index: 0, value: 'input_0' }, { index: 1, value: 'input_1' }, { index: 2, value: 'input_2' }], outputs: [{ index: 0, value: 'output_0' }] },
  });

  return (
    <View style={containerStyle}>
      <View style={headerStyle}><Text style={textStyle}>{`<h1>Node Editor</h1>`}</Text></View>
      <View style={editorStyle}>
        <Canvas
          nodes={nodes}
          updateNode={(id, data) => setNodes({ ...nodes, [id]: data })}
          addNode={(data) => setNodes({ ...nodes, [Object.keys(nodes).length + 1]: data })}
        />
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

const PortsContainer = (input: boolean) => `
  display: flex;
  flex-direction: column;
  align-items: flex-${input ? 'start' : 'end'};
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

const ComboBoxStyle = `
QComboBox {
    border: 1px solid black;
    border-radius: 3px;
    padding: 1px 18px 1px 3px;
    width: 25em;
    background-color: black;
}

QComboBox::drop-down {
    subcontrol-origin: padding;
    subcontrol-position: top right;
    width: 25px;

    border-top-right-radius: 3px; /* same radius as the QComboBox */
    border-bottom-right-radius: 3px;
}

QComboBox::down-arrow {
  image: url(/something);
}
`;
