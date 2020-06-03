import React, { useReducer } from "react";
import { Text, View, Button, useEventHandler } from "@nodegui/react-nodegui";
import { QPushButtonSignals } from "@nodegui/nodegui";
import open from "open";
import { reducer } from '../reducers';
import { Canvas } from './Canvas';


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


export const Layout = () => {
  const btnHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => open("https://creativelogic.me").catch(console.log)
    },
    []
  );

  const [nodes, dispatch] = useReducer(reducer, {
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
          dispatch={dispatch}
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
