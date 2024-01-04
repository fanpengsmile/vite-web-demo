import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { keywordSearchSelectOptions } from '../../config';
import { isFunction } from 'lodash';
import { eventTrackingReport } from 'services/enterprise';

const formDefaultValues = {
  keywordSearchType: keywordSearchSelectOptions?.[0]?.value,
  keywordSearchValue: '',
};

export function KeywordSearch({ form, onSubmitSearch }: any) {
  const onBtnSubmitClick = () => {
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSubmitSearch) && onSubmitSearch();
    const keywordSearchValue = form.getFieldValue('keywordSearchValue');
    eventTrackingReport({
      event_type: 'request',
      level1_module: '找企业',
      level2_module: '全国企业圈选',
      level3_module: '企业查询',
      from_system: window.top === window.self ? '商机' : '其他',
      event_detail: keywordSearchValue,
    });
  };
  return (
    <Form form={form} initialValues={formDefaultValues}>
      <Form.Item style={{ marginBottom: '10px' }}>
        <Space.Compact>
          <Form.Item noStyle name='keywordSearchType' style={{ marginBottom: '10px' }}>
            <Select style={{ width: 100 }} options={keywordSearchSelectOptions} />
          </Form.Item>
          <Form.Item noStyle name='keywordSearchValue' style={{ marginBottom: '10px' }}>
            <Input style={{ width: 733 }} allowClear onPressEnter={onSubmitSearch} />
          </Form.Item>
          <Button type='primary' onClick={onBtnSubmitClick}>
            查询
          </Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
}
KeywordSearch.displayName = 'KeywordSearch';
