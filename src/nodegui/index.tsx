import { Renderer } from "@nodegui/react-nodegui";
import React from "react";
import App from "./app";
declare const module: any;

process.title = "Node Editor";
Renderer.render(<App />);
// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
  module.hot.accept(["./app"], function() {
    Renderer.forceUpdate();
  });
}
