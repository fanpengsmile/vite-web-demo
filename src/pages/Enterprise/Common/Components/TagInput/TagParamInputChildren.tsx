import React from 'react';
import { Form, Button } from 'antd';
import { CloseCircleTwoTone, FilterOutlined, EditOutlined } from '@ant-design/icons';
import { map } from 'lodash';
import { TagParamInput, buildEmptyTagParamInputValue } from './TagParamInput';

export function TagParamInputChildren({
  form,
  index,
  formItemName,
  formItemNamePrefixArr,
  allowSelectTag,
  disabled,
  tagMetaList,
  tagMetaListLoading,
  onOnlyOneChildExist,
  oneLevelDirTagList,
  setImportFieldsLevel,
  importFieldsLevel,
  setImportDialogVisible,
  options,
  setParamType,
  paramType,
}: any) {
  return (
    <Form.List name={formItemName}>
      {(fields, { add, remove }) => {
        return map(fields, (field, fieldIndex) => (
          <div>
            <TagParamInput
              form={form}
              formItemNamePrefixArr={[...formItemNamePrefixArr, ...formItemName]}
              setImportFieldsLevel={setImportFieldsLevel}
              importFieldsLevel={importFieldsLevel}
              index={field.name}
              allowSelectTag={allowSelectTag}
              isTagSelectorIsCascader
              disabled={disabled}
              tagMetaList={tagMetaList}
              tagMetaListLoading={tagMetaListLoading}
              isEventPropertyParamsInput={false}
              oneLevelDirTagList={oneLevelDirTagList}
            />
            <Button
              type='link'
              onClick={() => {
                if (fields?.length === 2) {
                  onOnlyOneChildExist(formItemNamePrefixArr, index, field.name);
                } else {
                  remove(field.name);
                }
              }}
            >
              <CloseCircleTwoTone />
            </Button>
            <Button
              type='link'
              onClick={() => {
                add(buildEmptyTagParamInputValue(false), fieldIndex + 1);
              }}
            >
              <FilterOutlined />
              添加筛选
            </Button>
            {options[field.name].dataType === 'STRING' ? (
              <Button
                onClick={() => {
                  setParamType(paramType);
                  setImportDialogVisible(true);
                  setImportFieldsLevel([index, field.name]);
                }}
                type='link'
              >
                <EditOutlined style={{ color: '#3da8f5' }} />
              </Button>
            ) : null}
          </div>
        ));
      }}
    </Form.List>
  );
}
TagParamInputChildren.displayName = 'TagParamInputChildren';
