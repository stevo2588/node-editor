import React from 'react';
import { Router, createMemorySource, createHistory, LocationProvider } from "@reach/router"
import styled from '@emotion/styled';
import Interfaces from './interfaces';


const Container = styled.div`
  display: flex;
  // height: 100%;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  color: white;
  background-color: rgb(50,50,50);
`;

export default ({ title, interfaces }: { title: string, interfaces: { graph: Record<string, any>, actions: { addProject: () => void } } }) => (
  <Container>
    <LocationProvider history={createHistory(createMemorySource('/'))}>
      <Router>
        <Interfaces path="/" {...interfaces} />
      </Router>
    </LocationProvider>
  </Container>
);
