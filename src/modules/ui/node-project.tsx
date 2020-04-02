import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine, NodeModelGenerics } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions, AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-widget';
import { BaseNodeModel } from './node-model';


const Text = styled.p`
  margin: 1px 1px;
  color: white;
  font-size: 1em;
  display: block;
`;

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name: string;
}

export class ProjectNodeModel extends BaseNodeModel {
  constructor({ name }: DefaultNodeModelOptions) {
    super({ type: 'project', name, color: 'rgb(0,120,255)' });
  }
}

export interface ProjectNodeProps {
	node: ProjectNodeModel;
	engine: DiagramEngine;
}

export const ProjectNodeWidget = (props: ProjectNodeProps) => (
  <BaseNodeWidget node={props.node} engine={props.engine}>
    <Text>Typescript</Text>
    <br />
    <Text>Artifacts:</Text>
    <Text>-build.zip</Text>
  </BaseNodeWidget>
);

export class ProjectNodeFactory extends AbstractReactFactory<ProjectNodeModel, DiagramEngine> {
	constructor() {
		super('project');
	}

	generateModel() {
		return new ProjectNodeModel({ name: 'Project' });
	}

	generateReactWidget(event: any): JSX.Element {
    return <ProjectNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
