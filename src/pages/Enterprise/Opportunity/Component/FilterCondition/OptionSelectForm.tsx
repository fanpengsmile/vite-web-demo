import React, { Fragment } from 'react';
import { Form, Select, Cascader, DatePicker, Spin, Popover } from 'antd';
import {
  formFieldsRenderedAsCheckboxGroup,
  formFieldsRenderedAsSelect,
  customOptionValue,
  formFieldsRenderedAsOneCheckboxGroup,
  formFieldNameForOneCheckboxGroup,
  titleDesc,
} from '../../config';
import { OptionSelectFormTitleContent } from './OptionSelectFormTitleContent';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { tagMeta, useRequestGetFilterOptionAvailableValue } from '../../../base/cgi';
import { reduce, isEmpty, includes, map, find, filter, get } from 'lodash';
import styles from './styles.module.css';
import { CheckboxButtonGroup } from '../../../Common/Components/CheckboxButtonGroup';
import './OptionSelectForm.css';

const searchFormDefaultValues = {
  ...reduce(
    [...formFieldsRenderedAsCheckboxGroup, ...formFieldsRenderedAsSelect],
    (result, fieldName) => {
      (result as any)[fieldName] = [];
      return result;
    },
    {},
  ),
  start_day_level: [],
  [formFieldNameForOneCheckboxGroup]: [],
};

export function OptionSelectForm({ form, onFormValuesChangeSubmit }: any) {
  const { filterOptionAvailableValue, filterOptionAvailableValueLoading } = useRequestGetFilterOptionAvailableValue() as any;
  const currentStartDayLevelValue = Form.useWatch('start_day_level', form);
  function renderCompanyStartTimeFormItem(
    filterOptionAvailableValue: { start_day_level: [] },
    currentStartDayLevelValue: [],
  ) {
    if (isEmpty(filterOptionAvailableValue)) {
      return null;
    }
    const options = [...filterOptionAvailableValue.start_day_level, { value: customOptionValue, label: '自定义' }];
    const startDateFormItemHidden = !includes(currentStartDayLevelValue, customOptionValue);
    return (
      <Form.Item style={{ marginBottom: '10px' }} label='成立时间'>
        <Form.Item style={{ marginBottom: '10px' }} name='start_day_level' noStyle>
          <CheckboxButtonGroup className='mr10' options={options} isCompact />
        </Form.Item>
        <Form.Item style={{ marginBottom: '10px' }} name='start_date' noStyle hidden={startDateFormItemHidden}>
          <DatePicker.RangePicker />
        </Form.Item>
      </Form.Item>
    );
  }

  function renderCheckboxButtonGroups(filterOptionAvailableValue: any, fieldNameList: any) {
    if (isEmpty(filterOptionAvailableValue) || isEmpty(fieldNameList)) {
      return null;
    }
    return map(fieldNameList, (fieldName) => {
      const targetTag = find(tagMeta, { field_name: fieldName });
      const fieldCnName = targetTag?.field_cn_name;
      const options = filterOptionAvailableValue[fieldName];
      const titleInfo = get(titleDesc, fieldCnName || '', '');
      return (
        <Form.Item
          style={{ marginBottom: '10px' }}
          key={fieldName}
          name={fieldName}
          label={
            titleInfo ? (
              <>
                {fieldCnName}
                <Popover
                  placement='right'
                  id='ckeck_bov_group_title'
                  content={<OptionSelectFormTitleContent content={titleInfo} />}
                  trigger='click'
                >
                  <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                </Popover>
              </>
            ) : (
              fieldCnName
            )
          }
        >
          <CheckboxButtonGroup options={options} isCompact />
        </Form.Item>
      );
    });
  }

  function renderOneCheckboxButtonGroup(formFieldsRenderedAsOneCheckboxGroup: any) {
    const targetTagList = filter(tagMeta, ({ field_name: fieldName }) =>
      includes(formFieldsRenderedAsOneCheckboxGroup, fieldName),
    );
    const options = map(targetTagList, ({ field_name: fieldName, field_cn_name: fieldCnName }) => ({
      value: fieldName,
      label: fieldCnName,
    }));
    return (
      <Form.Item style={{ marginBottom: '10px' }} name={formFieldNameForOneCheckboxGroup} noStyle>
        <CheckboxButtonGroup options={options} />
      </Form.Item>
    );
  }

  function renderSelects(filterOptionAvailableValue: any, fieldNameList: []) {
    if (isEmpty(filterOptionAvailableValue) || isEmpty(fieldNameList)) return null;
    return map(fieldNameList, (fieldName, index) => {
      const targetTag = find(tagMeta, { field_name: fieldName });
      const fieldCnName = targetTag?.field_cn_name;
      const options = filterOptionAvailableValue[fieldName];
      return (
        <Fragment key={fieldName}>
          <Form.Item style={{ marginBottom: '10px' }} key={fieldName} name={fieldName} noStyle>
            <Select
              mode='multiple'
              maxTagCount={1}
              options={options}
              placeholder={fieldCnName}
              style={{ width: 258, marginRight: 10, marginBottom: 2 }}
              allowClear
            />
          </Form.Item>
          {(index + 1) % 3 === 0 ? <br></br> : null}
        </Fragment>
      );
    });
  }
  return (
    <Spin spinning={!!filterOptionAvailableValueLoading}>
      <Form
        form={form}
        labelCol={{
          style: { width: '100px' },
        }}
        labelAlign='left'
        initialValues={searchFormDefaultValues}
        onValuesChange={onFormValuesChangeSubmit}
      >
        {!isEmpty(filterOptionAvailableValue) && (
          <Form.Item name='district' label='所在地区' style={{ marginBottom: '10px' }}>
            <Cascader
              style={{ maxWidth: 793 }}
              options={filterOptionAvailableValue?.district || []}
              multiple
              showSearch
              allowClear
              placeholder='请选择所在地区'
              popupClassName={styles['cascader-popup']}
            />
          </Form.Item>
        )}
        {!isEmpty(filterOptionAvailableValue) && (
          <Form.Item name='industry' label='所属行业' style={{ marginBottom: '10px' }}>
            <Cascader
              style={{ maxWidth: 793 }}
              options={filterOptionAvailableValue?.industry || []}
              multiple
              showSearch
              allowClear
              placeholder='请选择所属行业'
              popupClassName={styles['cascader-popup']}
            />
          </Form.Item>
        )}
        {renderCheckboxButtonGroups(filterOptionAvailableValue, formFieldsRenderedAsCheckboxGroup)}
        {renderCompanyStartTimeFormItem(filterOptionAvailableValue as any, currentStartDayLevelValue)}
        {!isEmpty(filterOptionAvailableValue) && (
          <Form.Item label='更多筛选' style={{ marginBottom: '10px' }}>
            <div>{renderSelects(filterOptionAvailableValue, formFieldsRenderedAsSelect as any)}</div>
            <div>{renderOneCheckboxButtonGroup(formFieldsRenderedAsOneCheckboxGroup)}</div>
          </Form.Item>
        )}
      </Form>
    </Spin>
  );
}
OptionSelectForm.displayName = 'OptionSelectForm';
