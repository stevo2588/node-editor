import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions, AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-widget';
import { BaseNodeModel } from './node-model';
import { IntegrationNodeModel } from './node-integration';


const Text = styled.p`
  margin: 1px 1px;
  color: white;
  font-size: 1em;
  display: block;
`;

const Artifact = styled.button`
  padding: 3px 5px;
  margin: 3px 0px;
  color: white;
  background-color: transparent;
  font-size: 1em;
  border: 1px solid white;
  border-radius: 3px;
  display: block;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    border: solid 1px black;
    background: rgba(255, 255, 255, 0.1);
    color: black;
  }
`;


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name: string;
  languages: string[];
  artifacts: { name: string, deploys: { type: string }[] }[];
}

export class ProjectNodeModel extends BaseNodeModel {
  languages: string[];
  artifacts: { name: string, deploys: { type: string }[] }[];
  constructor({ name, artifacts, languages }: DefaultNodeModelOptions) {
    super({ type: 'project', name, color: 'rgb(0,120,255)' });
    this.artifacts = artifacts;
    this.languages = languages;
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

export interface ProjectNodeProps {
	node: ProjectNodeModel;
	engine: DiagramEngine;
}

export const ProjectNodeWidget = (props: ProjectNodeProps) => (
  <BaseNodeWidget node={props.node} engine={props.engine}>
    <Text><b>{props.node.languages.join(' | ')}</b></Text>
    {props.node.artifacts.map(a => (
      <Artifact key={a.name} onMouseDown={e => e.stopPropagation()}>
        {a.deploys.map(d => (<React.Fragment key={d.type}><b>{d.type}</b><br /></React.Fragment>))}
        {a.name}
      </Artifact>
    ))}
  </BaseNodeWidget>
);

export class ProjectNodeFactory extends AbstractReactFactory<ProjectNodeModel, DiagramEngine> {
	constructor() {
		super('project');
	}

  // this is called for every node during "deserialization" to create the initial instance.
  // The deserialize method on the created instance is then called immediately after.
	generateModel({ initialConfig }: { initialConfig: { id: string, ports: any[], type: string, selected: boolean, x: number, y: number }}) {
		return new ProjectNodeModel({ name: 'Project', languages: [], artifacts: [] });
	}

	generateReactWidget(event: any): JSX.Element {
    return <ProjectNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
