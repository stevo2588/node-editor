import './index.css';
import Router from './router';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { safeDump as dumpYml, load as loadYml } from "js-yaml";
import { DiagramModel } from '../../../modules/graph/diagram';
import { NodeFactory } from './graph/factory';


export default ({ persistProject, graph, mainApi, load }: {
  persistProject: (p: any) => Promise<void>, graph: any, mainApi: any, load: any,
}) => {
  console.log('render');
  const [projectName, setProjectName] = useState(null);
  const [environments, setEnvironments] = useState({});
  const [providers, setProviders] = useState({});
  const [graphState, setGraphState] = useState<any>(null);
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
        projectContents = dumpYml(project, { skipInvalid: true });
        const res = await mainApi.saveFile('archie.yml', projectContents);
        console.log(`created new file from example project: ${res}`);
      }
      const project = load(projectContents);
      // const issues = validate(project);

      setProjectName(project.name);
      setEnvironments(project.environments);
      setProviders(project.providers);
      setGraphState(project.graph);
    };
    loadProject();
  }, []);

  useEffect(() => {
    const save = async () => {
      if (projectName == null) return;

      console.log('saving...');
      setProjectSaveStatus('in-progress');
      try {
        await persistProject({ name: projectName, environments, providers, graph: graphState });
        setProjectSaveStatus('success');
      } catch (err) {
        console.error(err);
        setProjectSaveStatus('failed');
      }
    };
    save();
  }, [graphState]);

  return (
    <Router
      saveStatus={projectSaveStatus}
      interfaces={{
        graphState,
        actions: {
          updateProject: (p: DiagramModel) => {
            setGraphState(p.serialize());
          },
          traverseGraph: (p: DiagramModel) => {
            mainApi.traverseGraph(p.serialize());
          },
        },
        graph: graph
          .map((M: any) => ({ [M.type]: { type: M, factory: new NodeFactory(M) } }))
          .reduce((a: any, b: any) => ({ ...a, ...b }), {})
      }}
    />
  );
};
