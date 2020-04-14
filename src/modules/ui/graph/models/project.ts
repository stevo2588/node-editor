import { BasePositionModelOptions, AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeModel } from './base';
import { IntegrationNodeModel } from './integration';


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  languages: string[];
  artifacts: { name: string, deploys: { type: string }[] }[];
}

export class ProjectNodeModel extends BaseNodeModel {
  languages: string[];
  artifacts: { name: string, deploys: { type: string }[] }[];
  constructor(name: string, opts?: DefaultNodeModelOptions) {
    super({ type: 'project', name, color: 'rgb(0,120,200)' });
    if (!opts) {
      this.artifacts = [];
      this.languages = [];
      this.addOutPort('empty');
      return;
    }
    this.artifacts = opts.artifacts;
    this.languages = opts.languages;
  }

	getIntegrations(): IntegrationNodeModel[] {
    console.log(this.portsOut.map(p => p.getLinks()));
    return this.portsOut
      .filter(p => Object.keys(p.getLinks()).length > 0)
      .map(p => Object.values(p.getLinks())[0].getTargetPort().getNode() as IntegrationNodeModel);
  }

	serialize() {
		return {
			...super.serialize(),
			artifacts: this.artifacts,
			languages: this.languages,
		};
	}

	deserialize(event: any): void {
    super.deserialize(event);
		this.artifacts = event.data.artifacts;
		this.languages = event.data.languages;
	}
}
