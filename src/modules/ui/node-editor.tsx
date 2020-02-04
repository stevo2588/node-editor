import React from 'react';
import createEngine, { DefaultLinkModel, DiagramModel, DefaultNodeModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import NodeCanvas from './node-canvas';
import { DiamondNodeModel, DiamondNodeFactory, SimplePortFactory, DiamondPortModel } from './node-custom';


const engine = createEngine();
engine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

const model = new DiagramModel();


const node1 = new DefaultNodeModel({ color: 'rgb(0,120,255)' });
node1.setPosition(50, 50);
let port1 = node1.addOutPort('Out');

const node2 = new DefaultNodeModel({ color: 'rgb(0,192,255)' });
node2.setPosition(200, 50);
let port2 = node2.addInPort('In');

var node3 = new DiamondNodeModel();
node3.setPosition(250, 108);

let link1 = port1.link<DefaultLinkModel>(port2);
link1.getOptions().testName = 'Test';
link1.addLabel('Hello World!');

model.addAll(node1, node2, node3, link1);

engine.setModel(model);


export default () => <NodeCanvas engine={engine} />;
