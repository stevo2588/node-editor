import React, { useEffect } from 'react';
import { Layout, Button, Typography, Form, Input } from 'antd';
import { NodeModel } from './graph/models/model';
import { DiagramModel } from '@projectstorm/react-diagrams';
const { Sider } = Layout;


export default ({ activeNodes, diagram }: { activeNodes: NodeModel[], diagram?: DiagramModel }) => {
  useEffect(() => {
    if (diagram && activeNodes.length <= 0) diagram.getNodes().forEach(n => n.setLocked(false));
  }, [activeNodes])

  const [form] = Form.useForm();

  if (!diagram) return null;

  return (
    <Sider
      onFocus={() => activeNodes.forEach(n => n.setLocked(true))}
      onBlur={() => activeNodes.forEach(n => n.setLocked(false))}
      collapsed={activeNodes.length <= 0}
      width={300}
      collapsedWidth={0}
      trigger={null}
      style={{ padding: '15px', marginRight: '-30px' }}
    >
      <Form name="sidebar" form={form} colon={false} layout="vertical" onFieldsChange={() => console.log('fields changed')} onValuesChange={() => console.log('values changed')}>
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
        ? Object.keys(activeNodes[0].schema).map(f => (
          <Form.Item key={f} label={activeNodes[0].schema[f].label} trigger="onBlur">
            <Input defaultValue={activeNodes[0].model[f]} placeholder={activeNodes[0].schema[f].placeholder} />
          </Form.Item>
      )) : null}
      </Form>
    </Sider>
  );
};
