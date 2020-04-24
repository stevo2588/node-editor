import React, { useEffect, useState } from 'react';
import createEngine from './engine';
import NodeCanvas from './canvas';
import { NodeModel } from './models/model';
import { DiagramModel } from './models/diagram';
import { DiagramEngine } from '@projectstorm/react-diagrams';


export type Props = {
  graph: any;
  graphState: any;
  graphPath: string;
  navigate: (path: string) => void;
  onUpdateActiveNodes: (nodes: any[]) => void;
  onUpdateDiagram: (diagram: DiagramModel) => void;
  updateProject: (state: any) => void;
}

let engine = new DiagramEngine();

const rootDiagram = new DiagramModel();

const diagramInit = (d: DiagramModel, onUpdateActiveNodes: (nodes: any[]) => void, updateProject: (state: any) => void, path = '') => {
  d.createNodeByType = (type: string) => engine.getFactoryForNode(type).generateModel({}) as NodeModel;
  d.path = path;
  d.registerListener({
    eventDidFire(event: any) {
      if (['offsetUpdated', 'zoomUpdated'].includes(event.function)) return;
      updateProject(rootDiagram); // must always update root diagram
    },
  });

  d.getNodes().forEach(n => {
    // n.clearListeners();
    n.registerListener({
      selectionChanged() { onUpdateActiveNodes(d.getSelectedEntities()); },
      modelChanged() { updateProject(rootDiagram); },
    });

    const containerNode = n as NodeModel;
    if (containerNode.graph) {
      diagramInit(containerNode.graph, onUpdateActiveNodes, updateProject, `${path}/${containerNode.graph.getID()}`);
    }
  });
};

export default ({ graphState, graphPath, graph, navigate, onUpdateActiveNodes, onUpdateDiagram, updateProject }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(false);
  const [availableNodes, setAvailableNodes] = useState<{ name: string, onAddNode: (model: { name: string }, position: { x: number, y: number }) => void }[]>([]);

  useEffect(() => {
    console.log(graph);
    // for (const nodeType in graph) {
    //   console.log(nodeType);
    //   engine.getNodeFactories().registerFactory(graph[nodeType].factory);
    // }
    engine = createEngine(Object.values(graph).map((v: any) => v.factory))

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
        name: graph[nodeType].type.displayType,
        onAddNode: ({ name }: { name: string }, { x, y }: { x: number, y: number }) => {
          const curDiagram = engine.getModel() as DiagramModel;
          // const node = new NodeModel(!!graph[nodeType].contains, nodeType, name, graph[nodeType].color);
          const node = graph[nodeType].factory.generateModel();
          node.setPosition(x, y);
          node.registerListener({
            selectionChanged() { onUpdateActiveNodes(curDiagram.getSelectedEntities()); },
          });
          if (graph[nodeType].type.contains) {
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
