import React from 'react';
import styled from '@emotion/styled';
import NodeEditor from './node-editor';
import SideBar from './sidebar';


const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 1000px;
  border-top: solid 2px rgb(100,100,100);
`;


export default ({ path, graph, actions }: { path: string, graph: Record<string, any>, actions: { addProject: () => void } }) => (
  <Container>
    <SideBar />
    <NodeEditor graph={graph} />
  </Container>
);
