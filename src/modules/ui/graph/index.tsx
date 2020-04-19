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
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory } from '@projectstorm/react-canvas-core';
import NodeCanvas from './canvas';
import { MiddlewareLinkFactory } from './link';
import { PortFactory } from './port';
import { NodeModel } from './models/model';


export type Props = {
  graph: any;
  graphState: any;
  graphPath: string;
  navigate: (path: string) => void;
  onUpdateActiveNodes: (nodes: any[]) => void;
  onUpdateDiagram: (diagram: DiagramModel) => void;
  updateProject: (state: any) => void;
}

const engine = new DiagramEngine();
engine.getLayerFactories().registerFactory(new NodeLayerFactory());
engine.getLayerFactories().registerFactory(new LinkLayerFactory());
engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
engine.getPortFactories().registerFactory(new PortFactory());


const state = new DefaultDiagramState();
state.dragNewLink.config.allowLooseLinks = false;
engine.getStateMachine().pushState(state);

const rootDiagram = new DiagramModel();

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
      modelChanged() {
        updateProject(rootDiagram); // must always update root diagram
      },
    });

    const containerNode = n as NodeModel;
    if (containerNode.graph) {
      diagramInit(containerNode.graph, onUpdateActiveNodes, updateProject, `${path}/${containerNode.graph.getID()}`);
    }
  });
};

export default ({ graphState, graphPath, graph, navigate, onUpdateActiveNodes, onUpdateDiagram, updateProject }: Props) => {
  console.log(graphPath);
  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(false);
  const [availableNodes, setAvailableNodes] = useState<{ name: string, onAddNode: (model: { name: string }, position: { x: number, y: number }) => void }[]>([]);

  useEffect(() => {
    console.log('graph');
    console.log(graph);
    for (const nodeType in graph) {
      console.log(nodeType);
      engine.getNodeFactories().registerFactory(graph[nodeType].factory);
    }
    engine.getLinkFactories().registerFactory(new MiddlewareLinkFactory());

    engine.registerListener({
      navigateToDiagram(event: any) {
        navigate(`graph/${event.nav.path}`);
      },
    });

    setLoaded2(true);
    console.log('useEffect 1');
  }, []);

  useEffect(() => {
    let cur = rootDiagram;
    let curType: string|undefined;
    graphPath.split('/').filter(i => i).forEach((id) => {
      const match = cur.getModels()
        .map(m => m as NodeModel)
        .filter(m => m.graph)
        .find(m => m.graph?.getID() === id);
      if (match && match.graph) {
        cur = match.graph;
        curType = match.getType();
      }
    });

    if (!cur) throw new Error('path invalid');

    if (engine.getModel()) engine.getModel().clearSelection();
    engine.setModel(cur);
    onUpdateDiagram(cur);

    let avail = [];
    if (curType && graph[curType].type?.contains) avail = graph[curType].type.contains || [];
    else avail = Object.keys(graph).filter(nodeType => graph[nodeType].type.root);

    const availNodes = avail
      .map((nodeType: string) => ({
        key: nodeType,
        name: nodeType,
        onAddNode: ({ name }: { name: string }, { x, y }: { x: number, y: number }) => {
          const curDiagram = engine.getModel();
          // const node = new NodeModel(!!graph[nodeType].contains, nodeType, name, graph[nodeType].color);
          const node = graph[nodeType].factory.generateModel();
          node.setPosition(x, y);
          node.registerListener({
            selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
          });
          if (graph[nodeType].type.contains) {
            // @ts-ignore
            diagramInit(node.graph, onUpdateActiveNodes, updateProject, `${curDiagram.path}/${node.graph.getID()}`);
          }
          curDiagram.addNode(node);
          // updateProject(diagram);
        } }));

    setAvailableNodes(availNodes);

    console.log('useEffect 2');
  }, [graphPath]);

  useEffect(() => {
    if (loaded || !graphState) return;

    // TODO: panning is randomly broken upon starting app (happens every few times). Init race condition maybe?

    rootDiagram.deserializeModel(graphState, engine);
    console.log('deserialized')

    diagramInit(rootDiagram, onUpdateActiveNodes, updateProject);

    setLoaded(true);
    console.log('useEffect 3');
  }, [graphState]);

  if (!loaded2) return null;

  return <NodeCanvas engine={engine} nodes={availableNodes} />;
};
