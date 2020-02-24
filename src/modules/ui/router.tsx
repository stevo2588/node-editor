import React from 'react';
import { Router, createMemorySource, createHistory, LocationProvider } from "@reach/router"
import Interfaces from './interfaces';


export default ({ title, interfaces }: { title: string, interfaces: { graph: Record<string, any>, actions: { addProject: () => void } } }) => (
  <>
  <h1>{title}</h1>
  <LocationProvider history={createHistory(createMemorySource('/'))}>
    <Router>
      <Interfaces path="/" {...interfaces} />
    </Router>
  </LocationProvider>
  </>
);
