import React from 'react';
import { last } from 'lodash';
import { Card, Tag, Cascader, Button, Form, Space, message, Radio } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import styles from '../../../base/styles.module.css';
import { useEventDetailList } from '../../../base/cgi';
import { TagParamInputGroup } from './TagParamInputGroup';
import './TagParam.css';

const eventTypeTagFieldName = 'eventTypeTag';
const eventIdFieldName = 'event';
const propertyParamInputGroupFieldName = 'eventPropertyParams';
export const globalLogicForEventPropertyParamInputFieldName = 'globalLogicForEventPropertyParamInput';
const eventTypeTagOptions = [
  { value: 1, label: '包含' },
  { value: 0, label: '排除' },
];

export const BehaviorParamInput = ({
  form,
  formItemNamePrefixArr,
  index,
  disabled,
  eventList,
  triggerDelete,
  clearPackageSizePredictResult,
  importFieldsValue,
  setImportFieldsLevel,
  importFieldsLevel,
  setParamType,
  behaviorFieldIndex,
  importInitValue,
}: any) => {
  const eventTypeTagFormItemName = [index, eventTypeTagFieldName];
  const eventFormItemName = [index, eventIdFieldName];
  const propertyParamInputGroupFormItemName = [index, propertyParamInputGroupFieldName];
  const eventValue = Form.useWatch([...formItemNamePrefixArr, ...eventFormItemName], form);
  const eventId: any = last(eventValue);
  const { eventDetailList, eventDetailListLoading } = useEventDetailList(eventId);

  return (
    <Card size='small' type='inner' id='tagparam_card' className={styles['behavior-param-input-wrapper']}>
      <Space>
        <Form.Item style={{ marginBottom: '0' }}>
          <Tag color='blue'>{index + 1}</Tag>
        </Form.Item>
        <Form.Item name={eventTypeTagFormItemName} style={{ marginBottom: '0' }}>
          <Radio.Group
            options={eventTypeTagOptions}
            id='disable_style_radio'
            optionType='button'
            buttonStyle='solid'
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item
          name={eventFormItemName}
          style={{ marginBottom: '0' }}
          rules={[{ required: true, message: '必须选择一个用户行为' }]}
        >
          <Cascader
            style={{ width: 200 }}
            popupClassName={styles['cascader-popup']}
            disabled={disabled}
            options={eventList}
            showSearch
            allowClear={false}
            placeholder='请选择用户行为'
            displayRender={(labels) => labels[labels.length - 1]}
          />
        </Form.Item>
        {!disabled && (
          <Form.Item style={{ marginBottom: '0' }}>
            <Button type='link' onClick={triggerDelete}>
              <CloseCircleTwoTone />
            </Button>
          </Form.Item>
        )}
      </Space>
      <Form.List
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={{ marginBottom: '0' }}
        name={propertyParamInputGroupFormItemName}
      >
        {(fields, { add, remove }) => (
          <TagParamInputGroup
            form={form}
            formItemName={[...formItemNamePrefixArr, ...propertyParamInputGroupFormItemName]}
            paramType='behavior'
            setParamType={setParamType}
            setImportFieldsLevel={setImportFieldsLevel}
            importFieldsLevel={importFieldsLevel}
            importFieldsValue={importFieldsValue}
            importInitValue={importInitValue}
            allowSelectTag
            behaviorFieldIndex={behaviorFieldIndex}
            isBehaviorParamInput={true}
            disabled={disabled}
            formListFields={fields}
            formListRemove={remove}
            formListAdd={(index: number) => {
              if (fields?.length >= 25) {
                message.warning('不能添加更多筛选条件');
                return;
              }
              add(TagParamInputGroup.buildEmptyTagParamInputValue(), index + 1);
            }}
            tagMetaList={eventDetailList}
            tagMetaListLoading={eventDetailListLoading}
            allowNoAnyTagParamInput={false}
            isEventPropertyParamsInput
            eventId={eventId}
            globalLogicSwitchFormItemName={[
              ...formItemNamePrefixArr,
              index,
              globalLogicForEventPropertyParamInputFieldName,
            ]}
            isUseAlphabetIndex
            clearPackageSizePredictResult={clearPackageSizePredictResult}
          />
        )}
      </Form.List>
    </Card>
  );
};
BehaviorParamInput.displayName = 'BehaviorParamInput';
