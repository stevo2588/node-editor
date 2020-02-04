import React from 'react';
import { Router, createMemorySource, createHistory, LocationProvider } from "@reach/router"
import Interfaces from './interfaces';


export default ({ stuff, interfaces }: { stuff: string, interfaces: { addProject: () => void } }) => (
  <>
  <div>{stuff}</div>
  <LocationProvider history={createHistory(createMemorySource('/'))}>
    <Router>
      <Interfaces path="/" {...interfaces} />
    </Router>
  </LocationProvider>
  </>
);
