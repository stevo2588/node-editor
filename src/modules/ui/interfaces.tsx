import React, { useState } from 'react';
import styled from '@emotion/styled';
import NodeEditor, { Props } from './graph';
import SideBar from './sidebar';
import { NodeModel } from './graph/models/model';
import { Layout, Space, Select, Avatar, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from '@reach/router';
import { navigate } from './router';
import { DiagramModel } from './graph/models/diagram';
const { Header, Content, Footer } = Layout;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`;

export default ({ path, graphPath = '', saveStatus, actions, ...rest }: {
  path: string,
  graphPath?: string,
  graphState: any,
  graph: Props['graph'],
  saveStatus: string,
  actions: {
    updateProject: (state: any) => void,
    traverseGraph: (state: any) => void,
  },
}) => {
  const [selectedNodes, setSelectedNodes] = useState<NodeModel[]>([]);
  const [activeDiagram, setActiveDiagram] = useState<DiagramModel>();

  return (
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header>
          <Space direction="horizontal" style={{ flex: 1 }}>
            <Select defaultValue="dev" style={{ width: 120 }}>
              <Select.Option value="dev">Dev</Select.Option>
              <Select.Option value="stage">Stage</Select.Option>
              <Select.Option value="prod">Prod</Select.Option>
            </Select>
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
          <Space style={{ float: 'right' }}>
            <Button onClick={() => actions.traverseGraph(activeDiagram)}>Traverse Graph</Button>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Header>
        <Layout>
          <Content>
            <Container>
              <NodeEditor
                {...rest}
                graphPath={graphPath}
                navigate={path => { console.log(path); navigate(path); }}
                onUpdateActiveNodes={setSelectedNodes}
                onUpdateDiagram={setActiveDiagram}
                updateProject={actions.updateProject}
              />
            </Container>
          </Content>
          <SideBar activeNodes={selectedNodes} diagram={activeDiagram} />
        </Layout>
        <Footer style={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%', padding: '5px 15px' }}>
          Save status: {saveStatus}
        </Footer>
      </Layout>
  );
};
