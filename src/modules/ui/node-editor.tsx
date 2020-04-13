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
	DefaultLinkFactory,
	DefaultNodeFactory,
	DefaultPortFactory,
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory } from '@projectstorm/react-canvas-core';
import NodeCanvas from './node-canvas';
import { IntegrationNodeModel, IntegrationNodeFactory } from './node-integration';
import { ProjectNodeFactory, ProjectNodeModel } from './node-project';
import { MiddlewareLinkFactory } from './link-custom';


const engine = new DiagramEngine();
engine.getLayerFactories().registerFactory(new NodeLayerFactory());
engine.getLayerFactories().registerFactory(new LinkLayerFactory());
engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
engine.getPortFactories().registerFactory(new DefaultPortFactory());

engine.getNodeFactories().registerFactory(new IntegrationNodeFactory());
engine.getNodeFactories().registerFactory(new ProjectNodeFactory());
engine.getLinkFactories().registerFactory(new MiddlewareLinkFactory());

const state = new DefaultDiagramState();
state.dragNewLink.config.allowLooseLinks = false;
engine.getStateMachine().pushState(state);

const diagram = new DiagramModel();
engine.setModel(diagram);


export default ({ graph, onUpdateActiveNodes, updateProject }: { graph: any, onUpdateActiveNodes: (nodes: any[]) => void, updateProject: (state: any) => void, }) => {
  console.log('render graph');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded || !graph) return;

    console.log(graph);
    diagram.deserializeModel(graph, engine);
    console.log('deserialized')
    diagram.registerListener({
      // nodesUpdated() { setUpdated(updated+1); },
      // linksUpdated() { console.log('updating links'); setUpdated(updated+1); },
      eventDidFire(event: any) {
        if (['offsetUpdated', 'zoomUpdated'].includes(event.function)) return;
        console.log(event.function);
        updateProject(diagram);
      },
    });

    diagram.getNodes().forEach(n => {
      console.log('registerListener node');
      // n.clearListeners();
      n.registerListener({
        selectionChanged() { onUpdateActiveNodes(diagram.getSelectedEntities()); },
      });
      console.log('DONE registerListener node');
    });

    setLoaded(true);
    console.log('DONE registerListener diagram');
  }, [graph]);

  return <NodeCanvas
    engine={engine}
    onAddProjectNode={({ x, y }: { x: number, y: number }) => {
      const node = new ProjectNodeModel({ name: 'untitled', languages: [], artifacts: [] });
      node.addOutPort('empty');
      node.setPosition(x, y);
      node.registerListener({
        selectionChanged() { onUpdateActiveNodes(diagram.getSelectedEntities()); },
      });
      diagram.addNode(node);
      // updateProject(diagram);
    }}
    onAddIntegrationNode={({ x, y }: { x: number, y: number }) => {
      const node = new IntegrationNodeModel({ name: 'untitled', apis: [] });
      node.addInPort('empty');
      node.setPosition(x, y);
      node.registerListener({
        selectionChanged() { onUpdateActiveNodes(diagram.getSelectedEntities()); },
      });
      diagram.addNode(node);
      // updateProject(diagram);
    }}
  />;
};
