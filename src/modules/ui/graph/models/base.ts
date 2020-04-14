import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { DefaultPortModel } from '@projectstorm/react-diagrams';


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name: string;
	color?: string;
}

export abstract class BaseNodeModel extends NodeModel<NodeModelGenerics & { OPTIONS: DefaultNodeModelOptions }> {
	public name: string;
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

	constructor(options: DefaultNodeModelOptions) {
		super({
			type: 'default',
			name: options.name,
			color: 'rgb(0,192,255)',
			...options,
		});
		this.name = options.name;
		this.portsOut = [];
		this.portsIn = [];
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
		return {
			...super.serialize(),
			name: this.name,
		};
	}

	deserialize(event: any): void {
    super.deserialize(event);
    this.name = event.data.name;
	}
}
