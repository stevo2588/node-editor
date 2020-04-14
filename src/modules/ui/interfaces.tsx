import React, { useState } from 'react';
import styled from '@emotion/styled';
import NodeEditor from './graph';
import SideBar from './sidebar';
import { BaseNodeModel } from './graph/models/base';
import { Layout, Button, Space } from 'antd';
import { Breadcrumb } from 'antd';
import { Link } from '@reach/router';
import { navigate } from './router';
const { Header, Content, Footer } = Layout;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`;

export default ({ path, graphPath = '', graph, saveStatus, actions, ...rest }: { path: string, graphPath?: string, graph: any, saveStatus: string, actions: { updateProject: (state: any) => void } }) => {
  console.log(rest);
  const [selectedNodes, setSelectedNodes] = useState<BaseNodeModel[]>([]);

  return (
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header>
          <Space direction="horizontal">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/graph">home</Link>
              </Breadcrumb.Item>
              {graphPath.split('/').filter(i => i).map((p, i) => (
                <Breadcrumb.Item key={p}>
                  <Link to={`/graph/${p}`}>{p}</Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Space>
        </Header>
        <Layout>
          <Content>
            <Container>
              <NodeEditor graph={graph} graphPath={graphPath} navigate={path => { console.log(path); navigate(path); }} onUpdateActiveNodes={setSelectedNodes} updateProject={actions.updateProject} />
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
