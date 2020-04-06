import "core-js/stable";
import "regenerator-runtime/runtime";
import * as serviceWorker from './service-worker';
import { hot } from "react-hot-loader/root";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DiagramModel, DefaultLinkModel } from "@projectstorm/react-diagrams";
// import FileManager from './modules/fileManager';
import { load, validate } from './modules/project';
import UI from './modules/ui';
import exampleProject from '../static/exampleProject.yml';
import { generateCode } from 'spec-codegen/src/modules/generate';
import plugins from 'spec-codegen/src/modules/plugins';
import { IntegrationNodeModel } from "./modules/ui/node-integration";
import { ProjectNodeModel } from "./modules/ui/node-project";
// import createUI from './modules/ui';


const projectToState = (project: any) => {
  const model = new DiagramModel();

  const interfaceNodes: { [name: string]: IntegrationNodeModel } = {};
  let i = 0;
  for (const interf in project.interfaces) {
    const interfNode = new IntegrationNodeModel({
      name: `${project.interfaces[interf].name} (${interf})`,
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
      name: proj,
      languages: project.projects[proj].languages,
      artifacts: project.projects[proj].artifacts,
    });
    projNode.setPosition(40, i * 185 + 90);

    let j = 0;
    for (const interf of project.projects[proj].interfaces) {
      const interfNode = interfaceNodes[interf.name];

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
  // model.registerListener({ nodesUpdated: (node) => { node.}})

  return model;
};

const stateToProject = (s: any) => s; // TODO
const persistProject = async (p: any) => {
  console.log('TODO: update project config');
};

// const fileManager = new FileManager();

const project = load(exampleProject);
const issues = validate(project);

// generateCode('', plugins[0], fileManager);
const initialState = projectToState(project);

// Would prefer to use UI like this...
// createUI({ stuff: 'stuff' });
const UIView = hot(() => {
  console.log('render');
  const [projectState, setProjectState] = useState(initialState);
  const [dummy, setDummy] = useState(true); // use this to force update because modifying Model is not recognized
  const [projectSaveStatus, setProjectSaveStatus] = useState<'success'|'in-progress'|'failed'>('success');
  useEffect(() => {
    const save = async () => {
      console.log('saving...');
      setProjectSaveStatus('in-progress');
      try {
        await persistProject(stateToProject(projectState));
        setProjectSaveStatus('success');
      } catch (err) {
        console.error(err);
        setProjectSaveStatus('failed');
      }
    };
    save();
  }, [dummy]);

  return (
    <UI
      title={project.name}
      saveStatus={projectSaveStatus}
      interfaces={{
        graph: projectState,
        actions: {
          updateProject: (p: DiagramModel) => {
            setProjectState(p);
            setDummy(!dummy);
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
