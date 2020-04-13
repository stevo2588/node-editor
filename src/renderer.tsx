import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as serviceWorker from './service-worker';
import { hot } from "react-hot-loader/root";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { safeDump as dumpYml, load as loadYml } from "js-yaml";
import { DiagramModel, DefaultLinkModel } from "@projectstorm/react-diagrams";
// import FileManager from './modules/fileManager';
import { load, validate } from './modules/project';
import UI from './modules/ui';
// import exampleProject from '../static/exampleProject.yml';
import { generateCode } from 'spec-codegen/src/modules/generate';
import plugins from 'spec-codegen/src/modules/plugins';
import { IntegrationNodeModel } from "./modules/ui/node-integration";
import { ProjectNodeModel } from "./modules/ui/node-project";
import mainApi from "./mainApi";
// import createUI from './modules/ui';


const projectToGraph = (project: any) => {
  console.log(project);
  const model = new DiagramModel();

  const interfaceNodes: { [name: string]: IntegrationNodeModel } = {};
  let i = 0;
  for (const interf in project.interfaces) {
    const interfNode = new IntegrationNodeModel({
      // key: interf,
      name: `${project.interfaces[interf].name}`,
      apis: project.interfaces[interf].apis?.map((a: any) => a.name) || [],
    });
    interfaceNodes[interf] = interfNode;
    interfNode.setPosition(380, i * 130 + 85);
    model.addNode(interfNode);
    i++;
  }

  i = 0;
  for (const proj in project.projects) {
    const projNode = new ProjectNodeModel({
      // key: proj,
      name: proj,
      languages: project.projects[proj].languages,
      artifacts: project.projects[proj].artifacts,
    });
    projNode.setPosition(40, i * 185 + 90);

    let j = 0;
    for (const interf of project.projects[proj].interfaces) {
      console.log(interf);
      console.log(interf.key);
      const interfNode = interfaceNodes[interf.key];

      const portProj = projNode.addOutPort(j.toString());
      const portInterf = interfNode.addInPort(proj);
      let link = portProj.link<DefaultLinkModel>(portInterf);
      link.getOptions().testName = 'Test';
      // link.addLabel('Hello World!');
      model.addLink(link);
      j++;
    }

    projNode.addOutPort('empty');
    model.addNode(projNode);
    i++;
  }

  for (const interf in interfaceNodes) {
    interfaceNodes[interf].addInPort('empty');
  }

  return model;
};

const persistProject = async (p: any) => {
  console.log(p);
  const res = await mainApi.saveFile('archie.yml', dumpYml(p, { skipInvalid: true }));
};

// generateCode('', plugins[0], fileManager);

// Would prefer to use UI like this...
// createUI({ stuff: 'stuff' });
const UIView = hot(() => {
  console.log('render');
  const [projectName, setProjectName] = useState(null);
  const [environments, setEnvironments] = useState({});
  const [providers, setProviders] = useState({});
  const [graph, setGraph] = useState<any>(null);
  const [projectSaveStatus, setProjectSaveStatus] = useState<'success'|'in-progress'|'failed'>('success');

  useEffect(() => {
    const loadProject = async () => {
      // const fileManager = new FileManager();
      let projectContents;
      try {
        projectContents = await mainApi.loadFile('archie.yml');
      } catch (err) {
        console.log(err.message);
      }

      if (!projectContents) {
        // projectContents = exampleProject;
        const project = {
          name: 'Untitled',
          environments: {},
          providers: {},
          graph: (new DiagramModel()).serialize(),
        };
        console.log(project);
        projectContents = dumpYml(project, { skipInvalid: true });
        const res = await mainApi.saveFile('archie.yml', projectContents);
        console.log(`created new file from example project: ${res}`);
      }
      const project = load(projectContents);
      const issues = validate(project);

      setProjectName(project.name);
      setEnvironments(project.environments);
      setProviders(project.providers);
      setGraph(project.graph);
    };
    loadProject();
  }, []);

  useEffect(() => {
    const save = async () => {
      if (projectName == null) return;

      console.log('saving...');
      setProjectSaveStatus('in-progress');
      try {
        await persistProject({ name: projectName, environments, providers, graph });
        setProjectSaveStatus('success');
      } catch (err) {
        console.error(err);
        setProjectSaveStatus('failed');
      }
    };
    save();
  }, [graph]);

  return (
    <UI
      title={projectName || 'Untitled'}
      saveStatus={projectSaveStatus}
      interfaces={{
        graph,
        actions: {
          updateProject: (p: DiagramModel) => {
            setGraph(p.serialize());
          },
          // updateApi: () => {},
          // updateService: () => {},
          // updateResource: () => {},
        }
      }}
    />
  );
});
ReactDOM.render(<UIView/>, document.getElementById('root'));

serviceWorker.register();
