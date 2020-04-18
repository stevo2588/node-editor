import { PortModel } from './models/port';
import { AbstractModelFactory, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { NodeModel } from './models/model';


export class PortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
  // create: () => T;
	// constructor(type: { new(): T; type: string; }) {
  //   super(type.type);
  //   this.create = () => new type();
  // }
	constructor() {
    super('default');
	}

	generateModel(event: GenerateModelEvent) {
		return new PortModel('unknown', {
			in: true,
			label: 'unknown',
		});
	}
}
