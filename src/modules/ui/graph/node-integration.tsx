import React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-base';
import { IntegrationNodeModel } from './models/integration';


const Apis = styled.div`
  display: flex;
  min-width: 100px;
`;

const ApisContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Api = styled.button`
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

const ApiAdd = styled.button`
  flex-grow: 1;
  padding: 0px 5px;
  margin: 3px 0px;
  display: inline-block;
  color: rgba(255,255,255,0.6);
  background-color: transparent;
  font-size: 1em;
  border: 1px dashed rgba(255,255,255,0.6);
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


export const IntegrationNodeWidget = ({ node, engine }: { node: IntegrationNodeModel; engine: DiagramEngine; }) => (
  <BaseNodeWidget node={node} engine={engine}>
    <Apis>
      <ApisContainer>
        {node.apis.map(a => <Api key={a} onMouseDown={e => e.stopPropagation()}>{a}</Api>)}
        <ApiAdd onMouseDown={e => e.stopPropagation()}>+</ApiAdd>
      </ApisContainer>
    </Apis>
  </BaseNodeWidget>
);

export class IntegrationNodeFactory extends AbstractReactFactory<IntegrationNodeModel, DiagramEngine> {
	constructor() { super('integration'); }
	generateModel(event: any) { return new IntegrationNodeModel('Integration', { apis: [] }); }
	generateReactWidget(event: any) {
    return <IntegrationNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
