import React from 'react';
import { Layout, Button, Typography, Form } from 'antd';
import { NodeModel } from './graph/models/model';
const { Sider } = Layout;


export default ({ activeNodes }: { activeNodes: NodeModel[] }) => {
  // const projectNodes = activeNodes
  //   .filter(n => n.getType() === 'project')
  //   .map(n => n as ProjectNodeModel);
  // const integrationNodes = activeNodes
  //   .filter(n => n.getType() === 'integration')
  //   .map(n => n as IntegrationNodeModel);
  const projectNodes = [];
  const integrationNodes = [];

  return (
    <Sider collapsed={activeNodes.length <= 0} width={300} collapsedWidth={0} trigger={null} style={{ padding: '15px', marginRight: '-30px' }}>
      <Form name="sidebar">
      {activeNodes.map(p => (
        <Form.Item required key={p.getID()}>
          <Typography.Title level={4} editable>
            {p.name}
          </Typography.Title>
        </Form.Item>
      ))}
      {!(projectNodes.length > 0 && integrationNodes.length > 0) ? (
        <div>
        {integrationNodes.length > 0 ? (
          <>
            <Form.Item>
              <Button type="primary" htmlType="button">Generate Code</Button>
            </Form.Item>
            {integrationNodes.length === 1 && (
            <Form.Item>
              <Button>Edit Service</Button>
            </Form.Item>
            )}
          </>
        ) : null}
        {projectNodes.length === 1 ? (
          <>
            <Form.Item>
              <Button type="primary" htmlType="button">Generate Code</Button>
            </Form.Item>
            <Form.Item>
              <Button>Open Project</Button>
            </Form.Item>
          </>
        ) : null}
        </div>
      ) : null}
      </Form>
    </Sider>
  );
};
