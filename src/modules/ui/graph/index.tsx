import React, { useEffect, useState } from 'react';
import {
	DefaultDiagramState,
	DiagramEngine,
	LinkLayerFactory,
	NodeLayerFactory,
  DiagramModel,
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
	DefaultPortFactory,
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory } from '@projectstorm/react-canvas-core';
import NodeCanvas from './node-canvas';
import { IntegrationNodeFactory } from './node-integration';
import { IntegrationNodeModel } from './models/integration';
import { ProjectNodeFactory } from './node-project';
import { ProjectNodeModel } from './models/project';
import { MiddlewareLinkFactory } from './link-custom';
import { ContainerNodeModel, ContainerNodeFactory } from './node-container';


const engine = new DiagramEngine();
engine.getLayerFactories().registerFactory(new NodeLayerFactory());
engine.getLayerFactories().registerFactory(new LinkLayerFactory());
engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
engine.getPortFactories().registerFactory(new DefaultPortFactory());

engine.getNodeFactories().registerFactory(new IntegrationNodeFactory());
engine.getNodeFactories().registerFactory(new ProjectNodeFactory());
engine.getNodeFactories().registerFactory(new ContainerNodeFactory());
engine.getLinkFactories().registerFactory(new MiddlewareLinkFactory());

const state = new DefaultDiagramState();
state.dragNewLink.config.allowLooseLinks = false;
engine.getStateMachine().pushState(state);

const rootDiagram = new DiagramModel();
engine.setModel(rootDiagram);

const diagramInit = (d: DiagramModel, onUpdateActiveNodes: (nodes: any[]) => void, updateProject: (state: any) => void, path = '') => {
  // @ts-ignore
  d.path = path;
  d.registerListener({
    // nodesUpdated() { setUpdated(updated+1); },
    // linksUpdated() { console.log('updating links'); setUpdated(updated+1); },
    eventDidFire(event: any) {
      if (['offsetUpdated', 'zoomUpdated'].includes(event.function)) return;
      // console.log(event.function);
      updateProject(rootDiagram); // must always update root diagram
    },
  });

  // d.fireEvent({ function: 'navigateToParent' }, 'specialHappened');

  d.getNodes().forEach(n => {
    // n.clearListeners();
    n.registerListener({
      selectionChanged() { onUpdateActiveNodes(d.getSelectedEntities()); },
    });

    if (n.getType() === 'container') {
      const containerNode = n as ContainerNodeModel;

      diagramInit(containerNode.graph, onUpdateActiveNodes, updateProject, `${path}/${containerNode.graph.getID()}`);
    }
  });
};

export default ({ graph, graphPath, navigate, onUpdateActiveNodes, updateProject }: { graph: any; graphPath: string; navigate: (path: string) => void; onUpdateActiveNodes: (nodes: any[]) => void; updateProject: (state: any) => void }) => {
  console.log(graphPath);
  const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   // engine.setModel(graphFromRouterState);
  //   engine.setModel(rootDiagram);
  // }, []);

  useEffect(() => {
    let cur = rootDiagram;
    graphPath.split('/').filter(i => i).forEach((id) => {
      const match = cur.getModels()
        .filter(m => m.getType() === 'container')
        .find(m => (m as ContainerNodeModel).graph.getID() === id);
      if (match) cur = (match as ContainerNodeModel).graph;
    });

    if (!cur) throw new Error('path invalid');
    engine.setModel(cur);
  }, [graphPath]);

  useEffect(() => {
    if (loaded || !graph) return;

    // TODO: panning is randomly broken upon starting app (happens every few times). Init race condition maybe?

    rootDiagram.deserializeModel(graph, engine);
    console.log('deserialized')

    diagramInit(rootDiagram, onUpdateActiveNodes, updateProject);

    engine.registerListener({
      navigateToDiagram(event: any) {
        navigate(`graph/${event.nav.path}`);
      },
    });

    setLoaded(true);
  }, [graph]);

  return <NodeCanvas
    engine={engine}
    onAddProjectNode={({ x, y }: { x: number, y: number }) => {
      const curDiagram = engine.getModel();
      const node = new ProjectNodeModel('untitled');
      node.setPosition(x, y);
      node.registerListener({
        selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
      });
      curDiagram.addNode(node);
      // updateProject(diagram);
    }}
    onAddIntegrationNode={({ x, y }: { x: number, y: number }) => {
      const curDiagram = engine.getModel();
      const node = new IntegrationNodeModel('untitled');
      node.setPosition(x, y);
      node.registerListener({
        selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
      });
      curDiagram.addNode(node);
      // updateProject(diagram);
    }}
    onAddContainerNode={({ x, y }: { x: number, y: number }) => {
      const curDiagram = engine.getModel();
      const node = new ContainerNodeModel('untitled');
      node.setPosition(x, y);
      node.registerListener({
        selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
      });
      // @ts-ignore
      diagramInit(node.graph, onUpdateActiveNodes, updateProject, `${curDiagram.path}/${node.graph.getID()}`);
      curDiagram.addNode(node);
    }}

  />;
};
