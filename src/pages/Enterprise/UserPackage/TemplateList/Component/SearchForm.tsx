import React from 'react';
import { Form, Col, Row, Input, Select, Button } from 'antd';
import StaffSelect from 'components/StaffSelect';
import { packageTemplateList } from '../../config';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

export function SearchForm(props: any) {
  const { setTemplateValue, templateValue, fetchTemplateNameList } = props;
  const [form] = Form.useForm();

  return (
    <Form
      onValuesChange={(v) => {
        setTemplateValue({
          ...templateValue,
          ...v,
        });
      }}
      form={form}
      {...FORM_ITEM_LAYOUT}
      colon={false}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name='name' label='模板名称'>
            <Input placeholder='请输入模板名称' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='create' label='创建人'>
            <StaffSelect placeholder='请输入任务责任人' clearable />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label='模板类型' name='type'>
            <Select
              style={{
                width: '100%',
                marginRight: '10px',
                textAlign: 'left',
              }}
              placeholder='请选择模板类型'
              allowClear
              options={packageTemplateList}
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: 'center' }}>
        <Button
          className='mr10'
          type='primary'
          onClick={() => {
            fetchTemplateNameList(true);
          }}
        >
          查询
        </Button>
        <Button
          onClick={() => {
            form.setFieldValue('name', '');
            form.setFieldValue('type', '');
            form.setFieldValue('create', '');
            fetchTemplateNameList();
          }}
        >
          重置
        </Button>
      </div>
    </Form>
  );
}
SearchForm.displayName = 'SearchForm';
