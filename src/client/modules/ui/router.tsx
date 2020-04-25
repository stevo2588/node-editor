import React from 'react';
import { Router, createMemorySource, createHistory, LocationProvider } from "@reach/router"
import styled from '@emotion/styled';
import Interfaces from './interfaces';
import { Props } from './graph';


const Container = styled.div`
  display: flex;
  // height: 100%;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  color: white;
  background-color: rgb(50,50,50);
`;

const rootPath = '/graph';

const history = createHistory(createMemorySource(rootPath));
export const navigate = (path: string) => history.navigate(path);

export default ({ saveStatus, interfaces }: {
  saveStatus: string,
  interfaces: {
    graphState: any,
    graph: Props['graph'],
    actions: {
      updateProject: (state: any) => void,
      codeGen: (state: any) => void,
      build: (state: any) => void,
      provision: (state: any) => void,
      deploy: (state: any) => void,
    },
  }
}) => {
  return (
    <Container>
      <LocationProvider history={history}>
        <Router>
          <Interfaces saveStatus={saveStatus} path="/graph/*graphPath" {...interfaces} />
        </Router>
      </LocationProvider>
    </Container>
  );
};
