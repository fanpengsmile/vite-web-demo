import React from 'react';
import { Form, DatePicker, Input, InputNumber, Card, Button, Row, Col, Select } from 'antd';
import StaffSelect from 'components/StaffSelect';
import { taskTypeOptions, userPackageTaskStatusOptions } from '../../config';
import { filter } from 'lodash';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const userPackageTaskStatusOptionsForSearchForm = filter(userPackageTaskStatusOptions, { isFilter: true });

export function SearchForm(props: any) {
  const { search, form } = props;
  const { submit, reset } = search;

  return (
    <Card>
      <Form form={form} {...FORM_ITEM_LAYOUT} colon={false}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='taskId' label='分群ID'>
              <InputNumber placeholder='请输入分群ID' controls={false} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='search_name' label='分群名称'>
              <Input placeholder='请输入分群名称' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='创建人' name='creator'>
              <StaffSelect placeholder='请输入创建人企业微信名' clearable />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='createTimeRange' label='创建时间'>
              <DatePicker.RangePicker format='YYYY-MM-DD' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='task_type_list' label='创建方式'>
              <Select placeholder='请选择创建方式' allowClear options={taskTypeOptions} mode='multiple' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='status_list' label='运行状态'>
              <Select
                placeholder='请选择运行状态'
                allowClear
                options={userPackageTaskStatusOptionsForSearchForm}
                mode='multiple'
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='desc' label='备注'>
              <Input placeholder='支持备注名模糊搜索' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }}>
          <Button className='mr10' type='primary' onClick={submit}>
            查询
          </Button>
          <Button onClick={reset}>重置</Button>
        </div>
      </Form>
    </Card>
  );
}
SearchForm.displayName = 'SearchForm';
