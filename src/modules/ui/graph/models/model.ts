import { NodeModel as Model, NodeModelGenerics, PortModelAlignment, DiagramModel } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { PortModel } from './port';


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
	readonly abstract defaultInputs: any[]; // TODO: enum
	readonly abstract defaultOutputs: any[]; // TODO: enum
	readonly abstract additionalInputs: any[]; // TODO: enum
  readonly abstract additionalOutputs: any[]; // TODO: enum
	protected portsIn: PortModel[];
	protected portsOut: PortModel[];

  constructor(isContainer: boolean, type: string, name: string, color: string) {
		super({
			type,
			name,
			color,
		});
		this.color = color;
		this.portsOut = [];
		this.portsIn = [];
    this.name = name;

    if (isContainer) this.graph = new DiagramModel();
  }

	public get outputs() {
		return []; // TODO
	}

	doClone(lookupTable: {}, clone: any) {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: PortModel) {
		super.removePort(port);
		if (port.in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
	}

	addPort<T extends PortModel>(port: T): T {
		super.addPort(port);
		if (port.in) {
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

	addInPort<U extends NodeModel>(type: { new(): U, type: string }, after = true) {
		const p = new PortModel(type.type, {
			in: true,
			label: type.type,
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort<U extends NodeModel>(type: { new(): U, type: string }, after = true) {
		const p = new PortModel(type.type, {
			in: false,
			label: type.type,
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

	getInPorts() {
		return this.portsIn;
	}

	getOutPorts() {
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

	deserialize(event: any) {
    super.deserialize(event);
    this.name = event.data.name;
    this.color = event.data.color;
    if (event.data.graph) {
      this.graph = new DiagramModel();
      this.graph.deserializeModel(event.data.graph, event.engine);
    }
  }
}
