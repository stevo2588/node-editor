import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DiagramModel } from '@projectstorm/react-diagrams';
import NodeEditor from './node-editor';
import TopBar from './topbar';
import SideBar from './sidebar';
import { BaseNodeModel } from './node-model';


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

export default ({ path, graph, saveStatus, actions }: { path: string, graph: DiagramModel, saveStatus: string, actions: { updateProject: (state: any) => void } }) => {
  const [selectedNodes, setSelectedNodes] = useState<BaseNodeModel[]>([]);

  return (
    <Container>
      <TopBar saveStatus={saveStatus} />
      <InnerContainer>
        <NodeEditor graph={graph} onUpdateActiveNodes={setSelectedNodes} updateProject={actions.updateProject} />
        <SideBar activeNodes={selectedNodes} />
      </InnerContainer>
    </Container>
  );
};
