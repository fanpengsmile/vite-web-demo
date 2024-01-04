import React from 'react';
import { Form, Card, Row, Col, Input, Select } from 'antd';
import StaffSelect from 'components/StaffSelect';
import { userIdTypeOptions } from '../../config';

const { Option } = Select;

function BaseInfo({ isDetail }: any) {
  return (
    <Card title='基础信息'>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            style={{ marginBottom: '0' }}
            name='task_name'
            label='分群画像名称'
            rules={[
              {
                required: true,
                message: '请选择负责人',
              },
            ]}
          >
            <Input disabled={isDetail} placeholder='请输入分群画像名称' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='data_type' label='用户ID类型' rules={[{ required: true, message: '请选择用户ID类型' }]}>
            <Select placeholder='请选择用户ID类型' disabled={isDetail}>
              {userIdTypeOptions.map((item) => (
                <Option disabled={item.value === 'company'} key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item style={{ marginBottom: '0' }} label='关注人' name='owner_list'>
            <StaffSelect placeholder='请输入任务责任人' multiple clearable />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}

export default BaseInfo;
