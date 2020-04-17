import { NodeModel as Model, NodeModelGenerics, PortModelAlignment, DiagramModel } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { DefaultPortModel } from '@projectstorm/react-diagrams';


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name: string;
	color: string;
}

export abstract class NodeModel extends Model<NodeModelGenerics & { OPTIONS: DefaultNodeModelOptions }> {
  graph?: DiagramModel;
  // model: any;
  public path = '/';
	public name: string;
	public color: string;
	public defaultInputs: any[] = []; // TODO: enum
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

  constructor(isContainer: boolean, type: string, name: string, color: string, opts?: { graph: DiagramModel } & BasePositionModelOptions) {
		super({
			type,
			name,
			color,
			...opts,
		});
		this.color = color;
		this.portsOut = [];
		this.portsIn = [];
    this.name = name;

    if (!opts) {
      // this.addInPort('empty');
      // this.addOutPort('empty');
      if (isContainer) this.graph = new DiagramModel();
      console.log(this.graph);
      return;
    }

    if (isContainer) this.graph = opts.graph;
  }

	public get outputs() {
		return []; // TODO
	}

	doClone(lookupTable: {}, clone: any): void {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: DefaultPortModel): void {
		super.removePort(port);
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
	}

	addPort<T extends DefaultPortModel>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}

	addInPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		if (!after) {
			this.portsOut.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	// getInputNodes<T extends BaseNodeModel>(): T[] {
	// 	return this.portsOut.map(p => p.getLinks()[0].getSourcePort().getNode() as T);
	// }

	// getOutNodes<T extends BaseNodeModel>(): T[] {
	// 	return this.portsOut.map(p => p.getLinks()[0].getSourcePort().getNode() as T);
	// }

	getInPorts(): DefaultPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): DefaultPortModel[] {
		return this.portsOut;
	}

	serialize() {
    const s: any = {
      ...super.serialize(),
			name: this.name,
			color: this.color,
    };

    if (this.graph) s.graph = this.graph.serialize();

    return s;
	}

	deserialize(event: any): void {
    super.deserialize(event);
    this.name = event.data.name;
    this.color = event.data.color;
    if (event.data.graph) {
      this.graph = new DiagramModel();
      this.graph.deserializeModel(event.data.graph, event.engine);
    }
  }
}
