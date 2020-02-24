import React from 'react';
import createEngine, { DefaultLinkModel, DiagramModel, DefaultNodeModel, PortModelAlignment, DefaultPortModel } from '@projectstorm/react-diagrams';
import NodeCanvas from './node-canvas';
import { DiamondNodeModel, DiamondNodeFactory, SimplePortFactory, DiamondPortModel } from './node-custom';


export default ({ graph }: { graph: Record<string, any> }) => {
  const engine = createEngine();
  engine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
  engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

  const model = new DiagramModel();

  let i = 1;
  for (const proj in graph.projects) {
    const node1 = new DefaultNodeModel({ color: 'rgb(0,120,255)', name: proj });
    node1.addOutPort('Out');
    node1.setPosition(i * 120, 50);
    model.addNode(node1);
    i++;
  }

  // const port1 = node1.getPort('Out') as DefaultPortModel;

  i = 1;
  for (const interf in graph.interfaces) {
    const node2 = new DefaultNodeModel({ color: 'rgb(0,192,255)', name: interf });
    const port2 = node2.addInPort('In');
    node2.setPosition(i * 120, 125);
    model.addNode(node2);
    i++;
  }

  i = 1;
  for (const service in graph.services) {
    // var node3 = new DiamondNodeModel({ name: service });
    const node3 = new DefaultNodeModel({ color: 'rgb(100,0,255)', name: service });
    node3.setPosition(i * 120, 200);
    node3.addInPort('In');
    model.addNode(node3);
    i++;
  }

  // let link1 = port1.link<DefaultLinkModel>(port2);
  // link1.getOptions().testName = 'Test';
  // link1.addLabel('Hello World!');


  // model.addAll(node1, node2, node3, link1);
  // model.addAll(...elements);

  engine.setModel(model);

  console.log(graph);

  return <NodeCanvas engine={engine} />;
};
