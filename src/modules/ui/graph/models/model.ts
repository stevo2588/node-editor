import { DiagramModel } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { BaseNodeModel } from './base';


export class NodeModel extends BaseNodeModel {
  graph?: DiagramModel;
  model: any;
  public path = '/';
  
  constructor(isContainer: boolean, type: string, name: string, color: string, opts?: { graph: DiagramModel } & BasePositionModelOptions) {
    super({ type, name, color });
    if (!opts) {
      this.addInPort('empty');
      this.addOutPort('empty');
      if (isContainer) this.graph = new DiagramModel();
      return;
    }
    if (isContainer) this.graph = opts.graph;
  }

	serialize() {
    const s: any = {
			...super.serialize(),
    };
    if (this.graph) s.graph = this.graph.serialize();

    return s;
	}

	deserialize(event: any): void {
    super.deserialize(event);
    if (event.data.graph && this.graph) this.graph.deserializeModel(event.data.graph, event.engine);
	}
}
