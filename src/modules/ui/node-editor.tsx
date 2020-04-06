import React, { useEffect, useState } from 'react';
import createEngine, { DefaultLinkModel, DiagramModel } from '@projectstorm/react-diagrams';
import NodeCanvas from './node-canvas';
import { IntegrationNodeModel, IntegrationNodeFactory } from './node-integration';
import { ProjectNodeFactory, ProjectNodeModel } from './node-project';


const engine = createEngine();
engine.getNodeFactories().registerFactory(new IntegrationNodeFactory());
engine.getNodeFactories().registerFactory(new ProjectNodeFactory());


export default ({ graph, onUpdateActiveNodes, updateProject }: { graph: DiagramModel, onUpdateActiveNodes: (nodes: any[]) => void, updateProject: (state: any) => void, }) => {
  // useEffect(() => updateModel(graph), []);
  console.log(graph);
  graph.getNodes().forEach(n => n.registerListener({
    selectionChanged() { onUpdateActiveNodes(graph.getSelectedEntities()); },
  }))
  engine.setModel(graph);

  return <NodeCanvas
    engine={engine}
    onAddProjectNode={({ x, y }: { x: number, y: number }) => {
      const node = graph.addNode(new ProjectNodeModel({ name: 'untitled', languages: [], artifacts: [] }));
      node.setPosition(x, y);
      updateProject(graph);
    }}
    onAddIntegrationNode={({ x, y }: { x: number, y: number }) => {
      const node = graph.addNode(new IntegrationNodeModel({ name: 'untitled', apis: [] }))
      node.setPosition(x, y);
      updateProject(graph);
    }}
  />;
};
