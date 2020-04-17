import {
	LinkModel,
	PortModel as PM,
	PortModelAlignment,
	PortModelGenerics as PMGenerics,
	PortModelOptions as PMOptions,
} from '@projectstorm/react-diagrams-core';
import { MiddlewareLinkModel } from './link';
import { AbstractModelFactory, DeserializeEvent } from '@projectstorm/react-canvas-core';


export interface PortModelOptions extends PMOptions {
	label?: string;
	in?: boolean;
}

export interface PortModelGenerics extends PMGenerics {
	OPTIONS: PortModelOptions;
}

export class PortModel extends PM<PortModelGenerics> {
	constructor(isIn: boolean, name?: string, label?: string);
	constructor(options: PortModelOptions);
	constructor(options: PortModelOptions | boolean, name?: string, label?: string) {
		if (!!name) {
			options = {
				in: !!options,
				name: name,
				label: label
			};
		}
		options = options as PortModelOptions;
		super({
			label: options.label || options.name,
			alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
			type: 'default',
			...options
		});
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.in = event.data.in;
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			in: this.options.in,
			label: this.options.label
		};
	}

	link<T extends LinkModel>(port: PM, factory?: AbstractModelFactory<T>): T {
		let link = this.createLinkModel(factory);
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link as T;
	}

	canLinkToPort(port: PM): boolean {
		if (port instanceof PortModel) {
			return this.options.in !== port.getOptions().in;
		}
		return true;
	}

	createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.generateModel({});
		}
		return link || new MiddlewareLinkModel();
	}
}
