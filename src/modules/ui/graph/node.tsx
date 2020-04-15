import React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-base';
import { NodeModel } from './models/model';


export const NodeWidget = ({ node, engine }: { node: NodeModel; engine: DiagramEngine; }) => (
  <BaseNodeWidget node={node} engine={engine} headerButtonAction={() => {
    // @ts-ignore
    engine.fireEvent({ nav: { path: node.graph.path } }, 'navigateToDiagram');
  }}>
  </BaseNodeWidget>
);

export class NodeFactory extends AbstractReactFactory<NodeModel, DiagramEngine> {
	constructor(type: string) { super(type); }
  // this is called for every node during "deserialization" to create the initial instance.
  // The deserialize method on the created instance is then called immediately after.
	generateModel({ initialConfig }: { initialConfig: { id: string, ports: any[], type: string, selected: boolean, x: number, y: number } }) {
    return new NodeModel(false, initialConfig.type, 'Untitled', 'red');
  }
	generateReactWidget(event: any) {
    return <NodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
