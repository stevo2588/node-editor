import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as serviceWorker from '../service-worker';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader/root";
import { safeDump as dumpYml, load as loadYml } from "js-yaml";
// import exampleProject from '../static/exampleProject.yml';
import UIView from './modules/ui';
import archieApi from "./modules/archieApi";
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
  ImplementedEventModel,
  ApiModel,
  ArtifactModel,
} from '../modules/graph';


const persistProject = async (p: any) => {
  const res = await archieApi.saveFile('archie.yml', dumpYml(p, { skipInvalid: true }));
};


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
      ImplementedEventModel,
      ApiModel,
      ArtifactModel,
    ]}
    mainApi={archieApi}
    load={loadYml}
  />
));

ReactDOM.render(
  <UI />,
  document.getElementById('root'),
);

serviceWorker.register();
