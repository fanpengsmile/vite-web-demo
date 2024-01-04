import React from 'react';
import { Form, Input, Card, Space, Button, Row, Col } from 'antd';

export function SearchForm({ form, triggerSearch, triggerReset }: any) {
  return (
    <Card className='mb15' bodyStyle={{ paddingBottom: 0 }}>
      <Form form={form}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='eventName' label='数据源名称'>
              <Input placeholder='请输入想要查询的数据源名称' allowClear />
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
