import React from 'react';
import { Router, createMemorySource, createHistory, LocationProvider } from "@reach/router"
import styled from '@emotion/styled';
import Interfaces from './interfaces';
import { DiagramModel } from '@projectstorm/react-diagrams';


const Container = styled.div`
  display: flex;
  // height: 100%;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  color: white;
  background-color: rgb(50,50,50);
`;

export default ({ title, saveStatus, interfaces }: { title: string, saveStatus: string, interfaces: { graph: any, actions: { updateProject: (state: any) => void } } }) => (
  <Container>
    <LocationProvider history={createHistory(createMemorySource('/'))}>
      <Router>
        <Interfaces saveStatus={saveStatus} path="/" {...interfaces} />
      </Router>
    </LocationProvider>
  </Container>
);
