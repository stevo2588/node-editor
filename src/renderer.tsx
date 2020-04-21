import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as serviceWorker from './service-worker';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader/root";
import { safeDump as dumpYml, load as loadYml } from "js-yaml";
import { load, validate } from './modules/project';
// import FileManager from './modules/fileManager';
// import exampleProject from '../static/exampleProject.yml';
import { generateCode } from 'spec-codegen/src/modules/generate';
import plugins from 'spec-codegen/src/modules/plugins';
import UIView from './modules/ui';
import mainApi from "./mainApi";
import {
  CodeModel,
  CodeGenModel,
  BuildModel,
  ServiceModel,
  ServiceHostModel,
  ApiMapperModel,
  CodeContainerModel,
  BuildContainerModel,
  ServiceContainerModel,
  TestModel,
} from './modules/ui/graph/models';


const persistProject = async (p: any) => {
  const res = await mainApi.saveFile('archie.yml', dumpYml(p, { skipInvalid: true }));
};

// generateCode('', plugins[0], fileManager);

const UI = hot(() => (
  <UIView
    persistProject={persistProject}
    graph={[
      CodeModel,
      CodeGenModel,
      TestModel,
      BuildModel,
      ServiceModel,
      ServiceHostModel,
      ApiMapperModel,
      CodeContainerModel,
      BuildContainerModel,
      ServiceContainerModel,
    ]}
    mainApi={mainApi}
    load={load}
    validate={validate}
  />
));

ReactDOM.render(
  <UI />,
  document.getElementById('root'),
);

serviceWorker.register();
