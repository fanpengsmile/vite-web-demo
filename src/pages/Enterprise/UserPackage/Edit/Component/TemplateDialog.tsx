import React, { useEffect } from 'react';
import { Form, Select, Modal, Input } from 'antd';
// import { components } from '@shared/common'
import { packageTemplateList, userIdTypeOptions } from '../../config';

// const { StaffSelect } = components
const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export function TemplateDialog({ showAddTemplateDialog, setShowAddTemplateDialog, submit, dataType }: any) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldValue('tem_type', 'user_package');
    form.setFieldValue('data_type', dataType);
  }, [dataType]);
  return (
    <Modal
      onCancel={() => setShowAddTemplateDialog(false)}
      open={showAddTemplateDialog}
      title='自定义标签保存为模板'
      onOk={async () => {
        const formFileds = await form.validateFields();
        await submit(formFileds, setShowAddTemplateDialog);
      }}
    >
      <Form form={form} {...FORM_ITEM_LAYOUT} className='mb15'>
        <Form.Item label='模板名称' name='tem_name' rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder='请输入模板名称'></Input>
        </Form.Item>
        <Form.Item label='模板说明' name='tem_desc'>
          <Input placeholder='请输入模板说明'></Input>
        </Form.Item>
        <Form.Item label='ID类型' name='data_type'>
          <Select
            style={{
              width: '100%',
              marginRight: '10px',
              textAlign: 'left',
            }}
            disabled
            placeholder='请选择模板类型'
            allowClear
            value={dataType}
            options={userIdTypeOptions.map((item) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              delete item.disabled;
              return item;
            })}
          />
        </Form.Item>
        <Form.Item label='模板类型' name='tem_type' rules={[{ required: true, message: '请选择模板类型' }]}>
          <Select
            style={{
              width: '100%',
              marginRight: '10px',
              textAlign: 'left',
            }}
            placeholder='请选择模板类型'
            allowClear
            disabled
            options={packageTemplateList}
          />
        </Form.Item>
        {/* <Form.Item label="关注人" name="tem_owner">
          <StaffSelect
            isForEnterprise
            placeholder="请输入关注人企微"
            mode="multiple"
          />
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
