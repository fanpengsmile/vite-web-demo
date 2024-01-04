import React from 'react';
import { isArray, last, find, map, includes, delay, some, isNil } from 'lodash';
import { Form, Space } from 'antd';
import { TagSelector } from './TagSelector';
import { OperatorSelector } from './OperatorSelector';
import { useCreation, useMemoizedFn } from 'ahooks';

import styles from '../../../base/styles.module.css';
import { useTagAvailableValueOptionList, useEventFieldOptionList } from '../../../base/cgi';
import { ParamValueInput } from './ParamValueInput';

export const tagFieldNameFieldName = 'tagFieldName';
export const operatorFieldName = 'operator';
export const valueFieldName = 'value';
export const tagIdFieldName = '_tagId';
export const dataTypeFieldName = 'dataType';

export const TagParamInput = ({
  form,
  index,
  formItemNamePrefixArr,
  allowSelectTag = true,
  isTagSelectorIsCascader = false,
  disabled = false,
  tagMetaList,
  tagMetaListLoading,
  isEventPropertyParamsInput = false,
  eventId,
  oneLevelDirTagList,
}: any) => {
  const tagFieldNameFormItemName = [index, tagFieldNameFieldName];
  const operatorFormItemName = [index, operatorFieldName];
  const valueFormItemName = [index, valueFieldName];
  const tagIdFormItemName = [index, tagIdFieldName];
  const dataTypeFormItemName = [index, dataTypeFieldName];

  const selectedTagFieldNameValue = Form.useWatch([...formItemNamePrefixArr, ...tagFieldNameFormItemName], form);
  const selectedTagFieldName = isArray(selectedTagFieldNameValue)
    ? last(selectedTagFieldNameValue)
    : selectedTagFieldNameValue;

  const selectedTagMeta = useCreation(
    () =>
      find(tagMetaList, {
        fieldName: selectedTagFieldName,
      }),
    [selectedTagFieldName],
  );
  const isSelectedTagCascader = selectedTagMeta?.dataType === 'CASCADER';

  const selectedOperatorValue = Form.useWatch([...formItemNamePrefixArr, ...operatorFormItemName], form);
  const tagOptions = useCreation(
    () =>
      map(tagMetaList, ({ fieldName, fieldCnName }) => ({
        value: fieldName,
        label: fieldCnName,
      })),
    [tagMetaList],
  );

  const { tagAvailableValueOptionList, tagAvailableValueOptionListLoading } = useTagAvailableValueOptionList(
    selectedTagFieldName,
    isSelectedTagCascader,
    !isEventPropertyParamsInput && includes(['STRING', 'CASCADER'], selectedTagMeta?.dataType),
  );

  const { eventFieldOptionList, eventFieldOptionListLoading } = useEventFieldOptionList(
    eventId,
    selectedTagMeta?.tagId,
    isEventPropertyParamsInput && selectedTagMeta?.dataType === 'STRING',
  );

  const clearValueFunc = () => {
    form.setFieldValue([...formItemNamePrefixArr, ...valueFormItemName], undefined);
  };
  const clearOpFunc = () => {
    form.setFieldValue([...formItemNamePrefixArr, ...operatorFormItemName], undefined);
  };

  const onTagSelectorChange = useMemoizedFn((newValue) => {
    const newSelectedTagFieldName = isArray(newValue) ? last(newValue) : newValue;
    const selectedTagMeta = find(tagMetaList, {
      fieldName: newSelectedTagFieldName,
    });

    clearValueFunc();
    clearOpFunc();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delay(() => {
      form.setFieldValue([...formItemNamePrefixArr, ...tagIdFormItemName], selectedTagMeta?.tagId);
      form.setFieldValue([...formItemNamePrefixArr, ...dataTypeFormItemName], selectedTagMeta?.dataType);
    });
  });

  return (
    <Form.Item className={styles['tag-param-input']} style={{ marginBottom: '5px' }}>
      <Space style={{ alignItems: 'start' }}>
        {allowSelectTag ? (
          <Form.Item
            name={tagFieldNameFormItemName}
            style={{ marginBottom: '0' }}
            rules={[{ required: true, message: '' }]}
          >
            <TagSelector
              disabled={disabled}
              options={isTagSelectorIsCascader ? oneLevelDirTagList : tagOptions}
              optionsLoading={tagMetaListLoading}
              onChange={onTagSelectorChange}
              isCascader={isTagSelectorIsCascader}
            />
          </Form.Item>
        ) : (
          <Form.Item style={{ marginBottom: '0' }}>
            <p style={{ width: '130px', margin: 0 }}>{selectedTagMeta?.fieldCnName}</p>
          </Form.Item>
        )}

        {!!selectedTagFieldName && (
          <Form.Item
            name={operatorFormItemName}
            style={{ marginBottom: '0' }}
            initialValue={OperatorSelector.getFirstOperator(selectedTagMeta?.dataType)}
          >
            <OperatorSelector
              disabled={disabled}
              dataType={selectedTagMeta?.dataType}
              clearValueFunc={clearValueFunc}
            />
          </Form.Item>
        )}
        <Form.Item
          name={valueFormItemName}
          style={{ marginBottom: '0' }}
          hidden={!selectedTagFieldName || !selectedOperatorValue}
          rules={[
            {
              required: ParamValueInput.judgeIsRequired(selectedOperatorValue),
              message: '',
            },
            {
              validator: async (rule, value) => {
                if (isArray(value) && some(value, (value) => isNil(value))) {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('');
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <ParamValueInput
            disabled={disabled}
            operatorValue={selectedOperatorValue}
            dataType={selectedTagMeta?.dataType}
            tagAvailableValueOptionList={
              isEventPropertyParamsInput ? eventFieldOptionList : tagAvailableValueOptionList
            }
            index={index}
            tagAvailableValueOptionListLoading={
              isEventPropertyParamsInput ? eventFieldOptionListLoading : tagAvailableValueOptionListLoading
            }
          />
        </Form.Item>
      </Space>
    </Form.Item>
  );
};
TagParamInput.displayName = 'TagParamInput';

export function buildEmptyTagParamInputValue(withChildren = true) {
  return {
    [tagIdFieldName]: undefined,
    [tagFieldNameFieldName]: undefined,
    [dataTypeFieldName]: undefined,
    key: Date.now(),
    ...(withChildren ? { children: [], logicForChildren: 'AND' } : {}),
  };
}
