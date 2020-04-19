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

  const [form] = Form.useForm();

  return (
    <Sider collapsed={activeNodes.length <= 0} width={300} collapsedWidth={0} trigger={null} style={{ padding: '15px', marginRight: '-30px' }}>
      <Form name="sidebar" form={form}>
      {activeNodes.map(p => (
        <React.Fragment key={p.getID()}>
        <Typography.Title level={4}>{p.displayType}</Typography.Title>
        <Form.Item required name="name">
          <Typography.Text editable={{ onChange: (t) => p.setName(t) }}>
            {p.name}
          </Typography.Text>
        </Form.Item>
        </React.Fragment>
      ))}
      {activeNodes.length === 1
        // @ts-ignore
        ? Object.keys(activeNodes[0].schema).map(f => (
          <Form.Item key={f}>
            <Button type="primary" htmlType="button">{activeNodes[0].schema[f].label}</Button>
          </Form.Item>
      )) : null}
      </Form>
    </Sider>
  );
};
