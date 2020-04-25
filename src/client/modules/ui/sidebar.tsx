import React, { useEffect } from 'react';
import { Layout, Button, Typography, Form, Input } from 'antd';
import { NodeModel } from '../../../modules/graph/model';
import { DiagramModel } from '../../../modules/graph/diagram';
const { Sider } = Layout;


export default ({ activeNodes, diagram }: { activeNodes: NodeModel[], diagram?: DiagramModel }) => {
  useEffect(() => {
    if (diagram && activeNodes.length <= 0) diagram.getNodes().forEach(n => n.setLocked(false));
  }, [activeNodes])

  // const [form] = Form.useForm();

  // useEffect(() => {
  //   form.se
  // })

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
      {activeNodes.map(p => (
        <React.Fragment key={p.getID()}>
        <Typography.Title level={4}>{p.displayType}</Typography.Title>
          <Typography.Text editable={{ onChange: (t) => p.setName(t) }}>
            {p.name}
          </Typography.Text>
        {activeNodes.length === 1
          ? (
          <Form
            name="sidebar"
            // form={form}
            colon={false}
            layout="vertical"
            onFieldsChange={() => console.log('fields changed')}
            onValuesChange={() => console.log('values changed')}
            onFinish={values => p.setModel(values)}
            initialValues={p.model}
          >
            {Object.keys(p.schema).map(f => (
              <Form.Item name={f} key={f} label={p.schema[f].label}>
                <Input placeholder={p.schema[f].placeholder} />
              </Form.Item>
            ))}
          </Form>
          ) : null}
        </React.Fragment>
      ))}
    </Sider>
  );
};
