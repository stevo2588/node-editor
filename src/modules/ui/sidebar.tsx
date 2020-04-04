import React from 'react';
import styled from '@emotion/styled';
import { BaseNodeModel } from './node-model';
import { IntegrationNodeModel } from './node-integration';
import { ProjectNodeModel } from './node-project';


const SideBar = styled.div<{ open: boolean }>`
  width: 180px;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  padding: 10px;
  position: fixed;
  top: 62px;
  right: 0;
  z-index: 1;
  margin-right: ${p => p.open ? '0px' : '-200px'};
  flex-direction: column;
  background-color: rgb(50, 50, 50) !important;
  border-left: solid 2px rgb(100,100,100);
  transition: 0.3s;
  transition-timing-function: ease-out;
`;

const Button = styled.button`
  padding: 3px 5px;
  margin: 3px 3px;
  display: inline-block;
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

const Title = styled.h2`
  font-size: 1em;
  margin: 2px;
`;

export default ({ activeNodes }: { activeNodes: BaseNodeModel[] }) => {
  const projectNodes = activeNodes
    .filter(n => n.getType() === 'project')
    .map(n => n as ProjectNodeModel);
  const integrationNodes = activeNodes
    .filter(n => n.getType() === 'integration')
    .map(n => n as IntegrationNodeModel);

  return (
    <SideBar open={activeNodes.length > 0}>
      {activeNodes.map(p => <Title key={p.getID()}>{p.getOptions().name}</Title>)}
      {!(projectNodes.length > 0 && integrationNodes.length > 0) ? (
        <div>
        {integrationNodes.length > 0 ? (
          <div>
            <Button>Generate Code</Button>
            {integrationNodes.length === 1 && <Button>Edit Service</Button>}
          </div>
        ) : null}
        {projectNodes.length === 1 ? (
          <div>
            <Button>Generate Code</Button>
          </div>
        ) : null}
        </div>
      ) : null}
    </SideBar>
  );
};
