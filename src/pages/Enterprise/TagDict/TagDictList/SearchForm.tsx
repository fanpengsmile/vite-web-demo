import React from 'react';
import { Form, Cascader, Input, Card, Space, Button, Row, Col, Select } from 'antd';
import { tagGroupOptions } from '../config';

export function SearchForm({ form, triggerSearch, triggerReset, tagDirList }: any) {
  return (
    <Card className='mb15' bodyStyle={{ paddingBottom: 0 }}>
      <Form form={form}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='tagName' label='标签中文名'>
              <Input placeholder='请输入想要查询的标签中文名，例如：注册时间' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='tagDirIdArr' label='标签目录'>
              <Cascader
                allowClear
                changeOnSelect
                showSearch
                fieldNames={{
                  label: 'dirName',
                  value: 'dirId',
                  children: 'children',
                }}
                options={tagDirList}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='tagGroup' label='ID类型'>
              <Select options={tagGroupOptions}></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Space>
                <Button type='primary' onClick={triggerSearch}>
                  查询
                </Button>
                <Button onClick={triggerReset}>重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
SearchForm.displayName = 'SearchForm';
