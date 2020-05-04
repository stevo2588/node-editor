import { Text, View, Button, useEventHandler } from "@nodegui/react-nodegui";
import { QPushButtonSignals } from "@nodegui/nodegui";
import React from "react";
import open from "open";

export const Layout = () => {
  const btnHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => open("https://creativelogic.me").catch(console.log)
    },
    []
  );

  return (
    <View style={containerStyle}>
      <Text style={textStyle} wordWrap={true}>
        {`
          <h1>Node Editor</h1>
        `}
      </Text>
      <Button
        style={btnStyle}
        on={btnHandler}
        text={`Do something`}
      ></Button>
    </View>
  );
}

const containerStyle = `
  flex: 1;
  justify-content: 'space-around';
`;

const textStyle = `
  padding-right: 20px;
`;

const btnStyle = `
  margin-horizontal: 20px;
  height: 40px;
`;
