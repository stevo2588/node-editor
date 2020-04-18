import {
	LinkModel,
	PortModel as PM,
	PortModelAlignment,
} from '@projectstorm/react-diagrams-core';
import { MiddlewareLinkModel } from './link';
import { AbstractModelFactory, DeserializeEvent } from '@projectstorm/react-canvas-core';


export class PortModel extends PM {
	public in: boolean;
	public label: string;
	constructor(private portType: string, options: { label: string, in: boolean }) {
		super({
			name: options.label,
			alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
			type: 'default',
		});

		this.in = options.in;
		this.label = options.label;
		// name is used to identify where link will stick when you click on a port so we need it to be unique
		this.options.name = this.getID();
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.in = event.data.in;
		this.label = event.data.label;
		// @ts-ignore
		this.portType = event.data.portType;
	}

	serialize() {
		return {
			...super.serialize(),
			in: this.in,
			label: this.label,
			portType: this.portType,
		};
	}

	// link<V extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<V>): V {
	// 	let link = this.createLinkModel(factory);
	// 	link.setSourcePort(this);
	// 	link.setTargetPort(port);
	// 	return link as V;
	// }

	allowNewLink() {
		const maximumLinks = this.in ? 1 : Infinity;
    return Object.keys(this.getLinks()).length < maximumLinks;
	}

	canLinkToPort(port: PortModel) {
		return port.portType === this.portType
			&& this.in !== port.in
			&& this.allowNewLink()
			&& port.allowNewLink();
	}

	createLinkModel(factory?: AbstractModelFactory<LinkModel>) {
		if (!this.allowNewLink()) return null;

		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.generateModel({});
		}
		return link || new MiddlewareLinkModel();
	}
}