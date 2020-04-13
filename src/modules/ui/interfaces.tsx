import React, { useState } from 'react';
import styled from '@emotion/styled';
import NodeEditor from './node-editor';
import SideBar from './sidebar';
import { BaseNodeModel } from './node-model';
import { Layout, Button } from 'antd';
const { Header, Content, Footer } = Layout;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`;

export default ({ path, graph, saveStatus, actions }: { path: string, graph: any, saveStatus: string, actions: { updateProject: (state: any) => void } }) => {
  const [selectedNodes, setSelectedNodes] = useState<BaseNodeModel[]>([]);

  return (
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header>
          <Button>Provision</Button>
        </Header>
        <Layout>
          <Content>
            <Container>
                <NodeEditor graph={graph} onUpdateActiveNodes={setSelectedNodes} updateProject={actions.updateProject} />
            </Container>
          </Content>
          <SideBar activeNodes={selectedNodes} />
        </Layout>
        <Footer style={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%', padding: '5px 15px' }}>
          Save status: {saveStatus}
        </Footer>
      </Layout>
  );
};
