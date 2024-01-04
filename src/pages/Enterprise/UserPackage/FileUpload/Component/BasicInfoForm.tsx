import React from 'react';
import { Card, Form, Row, Col, Input } from 'antd';
import '../../Edit/Component/basicInfoFrrm.css';
import StaffSelect from 'components/StaffSelect';

export function BasicInfoForm() {
  return (
    <Card title='基础信息' className='mb15'>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name='task_name' label='分群名称' rules={[{ required: true, message: '请输入分群名称' }]}>
            <Input placeholder='请输入分群名称' />
          </Form.Item>
        </Col>
        <Col span={8} id='owner_list_col'>
          <Form.Item name='owner_list' label='关注人'>
            <StaffSelect placeholder='请输入任务责任人' multiple clearable />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
BasicInfoForm.displayName = 'BasicInfoForm';
