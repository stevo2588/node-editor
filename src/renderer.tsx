import "core-js/stable";
import "regenerator-runtime/runtime";
import * as serviceWorker from './service-worker';
import { hot } from "react-hot-loader/root";
import React from 'react';
import ReactDOM from 'react-dom';
import FileManager from './modules/fileManager';
import { load, validate } from './modules/project';
import UI from './modules/ui';
// import createUI from './modules/ui';


// const fileManager = new FileManager();

// const project = load('../static/exampleProject', fileManager);
// const issues = validate(project);

// Would prefer to use UI like this...
// createUI({ stuff: 'Oh yeahssss' });
const UIView = hot(() => <UI
  interfaces={{
    addProject: () => {},
    // addService: () => {},
    // addInterface: () => {},
  }}
  stuff="oh yas?"
/>);
ReactDOM.render(<UIView/>, document.getElementById('root'));

serviceWorker.register();
