import React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-base';
import { ProjectNodeModel } from './models/project';


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

export interface ProjectNodeProps {
}

export const ProjectNodeWidget = (props: { node: ProjectNodeModel; engine: DiagramEngine; }) => (
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
	constructor() { super('project'); }
  // this is called for every node during "deserialization" to create the initial instance.
  // The deserialize method on the created instance is then called immediately after.
	generateModel({ initialConfig }: { initialConfig: { id: string, ports: any[], type: string, selected: boolean, x: number, y: number }}) {
		return new ProjectNodeModel('Project', { languages: [], artifacts: [] });
	}
	generateReactWidget(event: any) {
    return <ProjectNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
