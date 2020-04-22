import { NodeModel as Model, NodeModelGenerics, NodeModelListener } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions, BaseEntityEvent } from '@projectstorm/react-canvas-core';
import { PortModel } from './port';
import { DiagramModel } from './diagram';


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name: string;
	color: string;
}

interface Listener extends NodeModelListener {
	// @ts-ignore
	modelChanged?(event: BaseEntityEvent<NodeModel> & { model: {} | any }): void;
}

export abstract class NodeModel extends Model<NodeModelGenerics & { OPTIONS: DefaultNodeModelOptions; LISTENER: Listener }> {
	graph?: DiagramModel;
	containerPortToModelMap: Record<string, string> = {};
  abstract model: any;
  public path = '/';
	public name: string;
	public color: string;
	readonly abstract defaultInputs: typeof NodeModel[];
	readonly abstract defaultOutputs: typeof NodeModel[];
	readonly abstract additionalInputs: typeof NodeModel[];
  readonly abstract additionalOutputs: typeof NodeModel[];
	protected portsIn: PortModel[];
	protected portsOut: PortModel[];
	isReadonly = false;

	abstract get schema(): any;
	abstract get displayType(): string;

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

	abstract setAsIO(input: boolean): void;

	setName(name: string) {
		this.name = name;
		this.fireEvent({ model: { name } }, 'modelChanged');
	}

	setModel(model: Record<string, any>) {
		this.model = model;
		this.fireEvent({ model }, 'modelChanged');
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

		if (this.graph) {
			this.graph.removeNodeById(this.containerPortToModelMap[port.getID()]);
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

		if (this.graph) {
			const n = new type();
			n.isReadonly = true;
			this.graph.addInputNode(n);
			this.containerPortToModelMap[p.getID()] = n.getID();
		}

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

		if (this.graph) {
			const n = new type();
			n.isReadonly = true;
			this.graph.addOutputNode(n);
			this.containerPortToModelMap[p.getID()] = n.getID();
		}

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
		// if (this.graph) {
		// 	// @ts-ignore
		// 	return this.graph.getInputNodes().map(n => new PortModel(n.constructor.type, {
		// 		in: true,
		// 		// @ts-ignore
		// 		label: n.constructor.type,
		// 	}));
		// }

		return this.portsIn;
	}

	getOutPorts() {
		// if (this.graph) {
		// 	// @ts-ignore
		// 	return this.graph.getOutputNodes().map(n => new PortModel(n.constructor.type, {
		// 		in: false,
		// 		// @ts-ignore
		// 		label: n.constructor.type,
		// 	}));
		// }

		return this.portsOut;
	}

	serialize() {
    const s: any = {
      ...super.serialize(),
			name: this.name,
			color: this.color,
			model: this.model,
    };

    if (this.graph) {
			s.graph = this.graph.serialize();
			s.containerPortToModelMap = this.containerPortToModelMap;
		}

    return s;
	}

	deserialize(event: any) {
    super.deserialize(event);
    this.name = event.data.name;
		this.color = event.data.color;
		this.model = event.data.model;
    if (event.data.graph) {
      this.graph = new DiagramModel();
			this.graph.deserializeModel(event.data.graph, event.engine);
			this.containerPortToModelMap = event.data.containerPortToModelMap;
    }
  }
}
