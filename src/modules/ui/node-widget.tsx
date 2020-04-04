import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { BaseNodeModel } from './node-model';
import { DefaultPortModel } from '@projectstorm/react-diagrams';


export interface DefaultPortLabelProps {
	port: DefaultPortModel;
	engine: DiagramEngine;
}

export const PortLabel = styled.div`
  display: flex;
  margin-top: 1px;
  align-items: center;
`;

export const Label = styled.div`
  padding: 0 5px;
  flex-grow: 1;
`;

export const Port = styled.div`
  width: 10px;
  height: 10px;
  margin: 3px -7.5px;
  border-radius: 7px;
  border: solid 2px black;
  background: rgb(140, 140, 140);
  &:hover {
    border: solid 2px rgb(192, 255, 0);
    background: rgb(192, 255, 0);
  }
`;

const Node = styled.div<{ background: string; selected: boolean }>`
  background-color: ${p => p.background};
  border-radius: 5px;
  font-family: sans-serif;
  color: white;
  border: solid 2px black;
  overflow: visible;
  font-size: 11px;
  border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4);
`;

const Title = styled.div`
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  white-space: nowrap;
  justify-items: center;
`;

const TitleName = styled.div`
  flex-grow: 1;
  padding: 5px 5px;
`;

const Config = styled.button`
  padding: 2px 5px;
  margin: 3px 3px;
  margin-left: 8px;
  display: inline-block;
  color: white;
  background-color: transparent;
  font-size: 1em;
  border: 0px;
  border-radius: 3px;
  display: block;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: rgba(255, 255, 255, 0.1);
    color: black;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.28));
`;

const PortsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
`;


const NodePort = (props: DefaultPortLabelProps) => {
  const port = (
    <PortWidget engine={props.engine} port={props.port}>
      <Port />
    </PortWidget>
  );
  const label = null; //<Label>{props.port.getOptions().label}</Label>;

  return (
    <>
      {props.port.getOptions().in ? port : label}
      {props.port.getOptions().in ? label : port}
    </>
  );
}

export interface BaseNodeProps {
	node: BaseNodeModel;
  engine: DiagramEngine;
  children: React.ReactNode;
}

export const BaseNodeWidget = (props: BaseNodeProps) => (
  <Node
    data-default-node-name={props.node.getOptions().name}
    selected={props.node.isSelected()}
    background={props.node.getOptions().color || '#ffffff'}
  >
    <Title>
      <TitleName>{props.node.getOptions().name}</TitleName>
      <Config>&#9881;</Config>
    </Title>
    <Content>
      <PortsContainer>
        {props.node.getInPorts().map(port => <NodePort engine={props.engine} port={port} key={port.getID()} />)}
      </PortsContainer>
      <BodyContainer>{props.children}</BodyContainer>
      <PortsContainer>
        {props.node.getOutPorts().map(port => <NodePort engine={props.engine} port={port} key={port.getID()} />)}
      </PortsContainer>
    </Content>
  </Node>
);
