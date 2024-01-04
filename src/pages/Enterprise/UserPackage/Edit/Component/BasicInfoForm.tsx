/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Select, Input, message } from 'antd';
import StaffSelect from 'components/StaffSelect';
import { userIdTypeOptions } from '../../config';
import './basicInfoFrrm.css';
import { getTemplateList } from 'services/enterprise';
import { get, find } from 'lodash';

const { Option } = Select;

export function BasicInfoForm({ mode, currentTaskType, isUserPackage, applyTemplate, dataType }: any) {
  const isEditMode = mode === 'edit';
  const [templateNameList, setTemplateNameList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const fetchTemplateNameList = async () => {
    const [res, err] = await getTemplateList({
      page_index: 1,
      page_size: 1000,
      template_type_list: ['user_package'],
      data_type: dataType,
    });
    if (err) {
      message.error(err.message);
      return;
    }
    const selectOptions = [];
    const templateData = [];
    const listName = get(res, 'template_list', []);
    for (let i = 0; i < listName.length; i++) {
      const id = get(listName[i], 'template_id', '');
      const name = get(listName[i], 'template_name', '');
      selectOptions.push({
        label: name,
        value: id,
      });
      templateData.push({
        key: id,
        value: JSON.parse(get(listName[i], 'template_para', '[]')),
      });
    }
    // @ts-ignore
    setTemplateNameList(selectOptions);
    // @ts-ignore
    setTemplateList(templateData);
  };
  useEffect(() => {
    fetchTemplateNameList();
  }, [dataType]);
  return (
    <Card title='基础信息' className='mb15'>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name='task_name' label='分群名称' rules={[{ required: true, message: '请输入分群名称' }]}>
            <Input placeholder='请输入分群名称' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='data_type' label='用户ID类型' rules={[{ required: true, message: '请选择用户ID类型' }]}>
            <Select
              // options={userIdTypeOptions}
              placeholder='请选择用户ID类型'
              disabled={isEditMode}
            >
              {userIdTypeOptions.map((item) => (
                <Option
                  disabled={
                    !!((currentTaskType === 'extract' || currentTaskType === 'pkg_import') && item.value === 'phone')
                  }
                  key={item.value}
                  value={item.value}
                  label={item.label}
                >
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} id='owner_list_col'>
          <Form.Item name='owner_list' label='关注人'>
            <StaffSelect placeholder='请输入任务责任人' multiple clearable />
          </Form.Item>
        </Col>
        <Col hidden={!isUserPackage} span={6}>
          <Form.Item label='选择标签模板'>
            <Select
              style={{ width: 200, marginRight: '10px', textAlign: 'left' }}
              placeholder='选择标签模板'
              allowClear
              options={templateNameList}
              onChange={(v) => {
                const temValue = get(find(templateList, { key: v }), 'value', []);
                applyTemplate(temValue);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
