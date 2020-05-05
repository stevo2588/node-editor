import { Text, Window, hot, View } from "@nodegui/react-nodegui";
import React from "react";
import { QIcon } from "@nodegui/nodegui";
import { Layout } from "./components/layout";
import nodeguiIcon from "./assets/nodegui.jpg";
import rustModule from '../../rust/native/nodejs';

const minSize = { width: 1500, height: 850 };
const winIcon = new QIcon(nodeguiIcon);
class App extends React.Component {
  render() {
    return (
      <Window
        windowIcon={winIcon}
        windowTitle="Node Editor"
        minSize={minSize}
        styleSheet={styleSheet}
      >
        <View style={containerStyle}>
          {/* <Text id="welcome-text">{rustModule()}</Text> */}
          <Layout />
        </View>
      </Window>
    );
  }
}

const containerStyle = `
  flex: 1;
  width: 1500px;
  height: 850px;
`;

const styleSheet = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: auto;
    padding: 2rem;
  }

  html, body, #root {
    height: 100%;
    display: flex;
    flex-grow: 1;
    padding: 0;
    margin: 0;
  }

  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
`;

export default hot(App);
