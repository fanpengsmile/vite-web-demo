import React, { useEffect } from 'react';
import { Input, Card, Row, Col, Form, Select } from 'antd';
import { get } from 'lodash';
import StaffSelect from 'components/StaffSelect';
import FtSelect from '../../../Common/Components/FtSelect';

const { Option } = Select;
const userIdTypeOptions = [
  { value: 'uin', label: '云账号UIN', disabled: false },
  { value: 'company', label: '企业SID', disabled: false },
  // { value: 'phone', label: '电话号码', disabled: true },
];

function BasicInfo(props: any) {
  const { detailData, form, isDetail, staffname } = props;
  useEffect(() => {
    if (detailData) {
      form.setFieldsValue({
        task_name: get(detailData, 'task_name'),
        creator: get(detailData, 'creator'),
        owner_list: get(detailData, 'owner_list'),
        ft: get(detailData, 'owner_ft'),
        data_type: get(detailData, 'data_type'),
      });
    } else {
      form.setFieldsValue({
        creator: staffname,
        data_type: 'uin',
      });
    }
  }, [detailData]);

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
                <Option disabled={item.disabled} key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            style={{ marginBottom: '0' }}
            label='负责人'
            name='creator'
            rules={[
              {
                required: true,
                message: '请选择负责人',
              },
            ]}
          >
            <StaffSelect disabled={isDetail} placeholder='请输入任务责任人' clearable />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请选择所属FT',
              },
            ]}
            style={{ marginBottom: '0' }}
            name='ft'
            label='所属FT'
          >
            <FtSelect staffName={staffname} disabled={isDetail} placeholder='请选择所属FT' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item style={{ marginBottom: '0' }} label='关注人' name='owner_list'>
            <StaffSelect disabled={isDetail} placeholder='请输入任务责任人' multiple clearable />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
BasicInfo.displayName = 'ClusterInsightCreateBasicInfo';

export default BasicInfo;
