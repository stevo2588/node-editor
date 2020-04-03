import React from 'react';
import styled from '@emotion/styled';
import NodeEditor from './node-editor';
import TopBar from './topbar';
import SideBar from './sidebar';


const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 1000px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

export default ({ path, graph, actions }: { path: string, graph: Record<string, any>, actions: { addProject: () => void } }) => (
  <Container>
    <TopBar />
    <InnerContainer>
      <NodeEditor graph={graph} />
      <SideBar open={true} />
    </InnerContainer>
  </Container>
);
