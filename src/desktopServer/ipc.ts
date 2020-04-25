// @ts-ignore
global.Element = function(){};
// @ts-ignore
global.document = function(){};

import { ipcMain, App } from 'electron';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { traverseGraph, saveFile, loadFile } from './modules/project';
import createEngine from '../modules/graph/engine';
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


class NodeFactory extends AbstractModelFactory {
  create: () => any;
	constructor(type: { new(): any; type: string; }) {
    super(type.type);
    this.create = () => new type();
  }
	generateModel() {
    return this.create();
  }
}

// @ts-ignore
const engine = createEngine([
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
].map((M: any) => new NodeFactory(M)));


export default class IpcServer {
  constructor(private app: App) {}
  
  start() {
    ipcMain.handle("toMain", async (event, ...args) => {
      const [func, ...params] = args;

      switch (func) {
        case 'saveFile':
          return saveFile(params[0], params[1], (loc: 'home'|'desktop') => this.app.getPath(loc));
        case 'loadFile':
          return loadFile(params[0], (loc: 'home'|'desktop') => this.app.getPath(loc));
        case 'codeGen':
          return traverseGraph(params[0], engine);
        case 'build':
          return traverseGraph(params[0], engine);
        case 'provision':
          return traverseGraph(params[0], engine);
        case 'deploy':
          return traverseGraph(params[0], engine);
      
        default:
          break;
      }
    });
  }
};
