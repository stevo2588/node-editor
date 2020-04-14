import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { BaseNodeModel } from './base';
import { ProjectNodeModel } from './project';


export class IntegrationNodeModel extends BaseNodeModel {
  apis: string[];
  constructor(name: string, opts?: { apis: string[] } & BasePositionModelOptions) {
    super({ type: 'integration', name, color: 'rgb(180,100,150)' });
    if (!opts) {
      this.apis = [];
      this.addInPort('empty');
      return;
    }
    this.apis = opts.apis;
  }

	getProjects(): ProjectNodeModel[] {
		return this.portsOut.map(p => p.getLinks()[0].getSourcePort().getNode() as ProjectNodeModel);
  }
  
	serialize() {
		return {
			...super.serialize(),
			api: this.apis,
		};
	}

	deserialize(event: any): void {
    super.deserialize(event);
		this.apis = event.data.apis || [];
	}
}

