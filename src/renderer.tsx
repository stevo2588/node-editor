import "core-js/stable";
import "regenerator-runtime/runtime";
import * as serviceWorker from './service-worker';
import { hot } from "react-hot-loader/root";
import React from 'react';
import ReactDOM from 'react-dom';
import UI from './modules/ui';
// import createUI from './modules/ui';


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
