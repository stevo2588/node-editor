import "core-js/stable";
import "regenerator-runtime/runtime";
import * as serviceWorker from './service-worker';
import { hot } from "react-hot-loader/root";
import React from 'react';
import ReactDOM from 'react-dom';
// import FileManager from './modules/fileManager';
import { load, validate } from './modules/project';
import UI from './modules/ui';
import exampleProject from '../static/exampleProject.yml';
import { generateCode } from 'spec-codegen/src/modules/generate';
import plugins from 'spec-codegen/src/modules/plugins';
// import createUI from './modules/ui';


// const fileManager = new FileManager();

const project = load(exampleProject);
const issues = validate(project);

// generateCode('', plugins[0], fileManager);

// Would prefer to use UI like this...
// createUI({ stuff: 'stuff' });
const UIView = hot(() => <UI
  interfaces={{
    graph: project,
    actions: {
      addProject: () => {},
      // addService: () => {},
      // addInterface: () => {},
    }
  }}
  title="My Architecture"
/>);
ReactDOM.render(<UIView/>, document.getElementById('root'));

serviceWorker.register();
