import * as React from 'react';
import { DiagramEngine, DiagramModel } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions, AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-base';
import { BaseNodeModel } from './models/base';


export class ContainerNodeModel extends BaseNodeModel {
  graph: DiagramModel;
  public path = '/';
  
  constructor(name: string, opts?: { graph: DiagramModel } & BasePositionModelOptions) {
    super({ type: 'container', name, color: 'rgb(70,200,100)' });
    if (!opts) {
      this.addInPort('empty');
      this.addOutPort('empty');
      this.graph = new DiagramModel();
      return;
    }
    this.graph = opts.graph;
  }

	serialize() {
		return {
			...super.serialize(),
			graph: this.graph.serialize(),
		};
	}

	deserialize(event: any): void {
    super.deserialize(event);
    this.graph.deserializeModel(event.data.graph, event.engine);
	}
}

export const ContainerNodeWidget = ({ node, engine }: { node: ContainerNodeModel; engine: DiagramEngine; }) => (
  <BaseNodeWidget node={node} engine={engine} headerButtonAction={() => {
    // @ts-ignore
    engine.fireEvent({ nav: { path: node.graph.path } }, 'navigateToDiagram');
  }}>
  </BaseNodeWidget>
);

export class ContainerNodeFactory extends AbstractReactFactory<ContainerNodeModel, DiagramEngine> {
	constructor() { super('container'); }
	generateModel(event: any) { return new ContainerNodeModel('Container', { graph: new DiagramModel() }); }
	generateReactWidget(event: any) {
    return <ContainerNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}