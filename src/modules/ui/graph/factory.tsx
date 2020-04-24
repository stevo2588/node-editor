import React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { NodeModel } from './models/model';
import { NodeWidget } from './node';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';


export class NodeFactory<T extends NodeModel> extends AbstractReactFactory<NodeModel, DiagramEngine> {
  create: () => T;
	constructor(type: { new(): T; type: string; }) {
    super(type.type);
    this.create = () => new type();
  }
	generateModel() {
    return this.create();
  }
	generateReactWidget(event: any) {
    return <NodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
