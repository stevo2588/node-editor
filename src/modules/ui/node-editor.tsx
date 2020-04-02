import React from 'react';
import createEngine, { DefaultLinkModel, DiagramModel } from '@projectstorm/react-diagrams';
import NodeCanvas from './node-canvas';
import { IntegrationNodeModel, IntegrationNodeFactory } from './node-integration';
import { ProjectNodeFactory, ProjectNodeModel } from './node-project';


export default ({ graph }: { graph: Record<string, any> }) => {
  const engine = createEngine();
  // engine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
  engine.getNodeFactories().registerFactory(new IntegrationNodeFactory());
  engine.getNodeFactories().registerFactory(new ProjectNodeFactory());
  const model = new DiagramModel();

  const interfaceNodes: { [name: string]: IntegrationNodeModel } = {};
  let i = 0;
  for (const interf in graph.interfaces) {
    const interfNode = new IntegrationNodeModel({
      name: `${graph.interfaces[interf].name} (${interf})`,
      apis: graph.interfaces[interf].apis?.map((a: any) => a.name) || [],
    });
    interfaceNodes[interf] = interfNode;
    interfNode.setPosition(350, i * 130 + 15);
    model.addNode(interfNode);
    i++;
  }

  i = 0;
  for (const proj in graph.projects) {
    const projNode = new ProjectNodeModel({ name: proj });
    projNode.setPosition(40, i * 180 + 30);

    let j = 0;
    for (const interf of graph.projects[proj].interfaces) {
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

  engine.setModel(model);

  return <NodeCanvas engine={engine} />;
};
