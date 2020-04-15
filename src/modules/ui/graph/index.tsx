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
import { NodeFactory } from './node';
import { IntegrationNodeFactory } from './node-integration';
import { IntegrationNodeModel } from './models/integration';
import { ProjectNodeFactory } from './node-project';
import { ProjectNodeModel } from './models/project';
import { MiddlewareLinkFactory } from './link-custom';
import { ContainerNodeFactory, ContainerNodeModel } from './node-container';
import { NodeModel } from './models/model';


export type Props = {
  graph: {
    nodes: {
      [key: string]: {
        root?: boolean;
        contains?: string[];
        defaultInputs: string[];
        additionalInputs: string[];
        defaultOutputs: string[];
        additionalOutputs: string[]; // calculated
      };
    };
  };
  graphState: any;
  graphPath: string;
  navigate: (path: string) => void;
  onUpdateActiveNodes: (nodes: any[]) => void;
  updateProject: (state: any) => void;
}

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

export default ({ graphState, graphPath, graph, navigate, onUpdateActiveNodes, updateProject }: Props) => {
  console.log(graphPath);
  const [loaded, setLoaded] = useState(false);
  const [availableNodes, setAvailableNodes] = useState<{ name: string, onAddNode: (position: { x: number, y: number }) => void }[]>([]);

  useEffect(() => {
    console.log('graph');
    console.log(graph);
    for (const nodeType in graph) {
      engine.getNodeFactories().registerFactory(new NodeFactory(nodeType));
    }
    // engine.setModel(graphFromRouterState);
    // engine.setModel(rootDiagram);
    console.log('useEffect 1');
  }, []);

  useEffect(() => {
    let cur = rootDiagram;
    let curType: string|undefined;
    graphPath.split('/').filter(i => i).forEach((id) => {
      const match = cur.getModels()
        .filter(m => m.getType() === 'container')
        .find(m => (m as ContainerNodeModel).graph.getID() === id);
      if (match) {
        cur = (match as ContainerNodeModel).graph;
        curType = match.getType();
      }
    });

    if (!cur) throw new Error('path invalid');

    engine.setModel(cur);

    let avail = [];
    if (curType && graph.nodes[curType]?.contains) avail = graph.nodes[curType].contains || [];
    else avail = Object.keys(graph.nodes).filter(nodeType => graph.nodes[nodeType].root);

    const availNodes = avail
      .map(nodeType => ({
        key: nodeType,
        name: nodeType,
        onAddNode: ({ x, y }: { x: number, y: number }) => {
          const curDiagram = engine.getModel();
          const node = new NodeModel(!!graph.nodes[nodeType].contains, nodeType, nodeType, 'red');
          node.setPosition(x, y);
          node.registerListener({
            selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
          });
          if (graph.nodes[nodeType].contains) {
            // @ts-ignore
            diagramInit(node.graph, onUpdateActiveNodes, updateProject, `${curDiagram.path}/${node.graph.getID()}`);
          }
          curDiagram.addNode(node);
          // updateProject(diagram);
        } }));

    console.log(availNodes);
    setAvailableNodes(availNodes);

    console.log('useEffect 2');
  }, [graphPath]);

  useEffect(() => {
    if (loaded || !graphState) return;

    // TODO: panning is randomly broken upon starting app (happens every few times). Init race condition maybe?

    rootDiagram.deserializeModel(graphState, engine);
    console.log('deserialized')

    diagramInit(rootDiagram, onUpdateActiveNodes, updateProject);

    engine.registerListener({
      navigateToDiagram(event: any) {
        navigate(`graph/${event.nav.path}`);
      },
    });

    setLoaded(true);
    console.log('useEffect 3');
  }, [graphState]);

  return <NodeCanvas
    engine={engine}
    nodes={availableNodes}
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
