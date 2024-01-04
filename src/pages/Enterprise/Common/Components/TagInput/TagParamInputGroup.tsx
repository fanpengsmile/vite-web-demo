import React, { useState } from 'react';
import { isFunction, isNil, last, isEmpty, map, includes, isString, find } from 'lodash';
import { Button, Tag, message, Form, Card } from 'antd';
import { CloseCircleTwoTone, FilterOutlined, EditOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { TagParamInputGroupImportDialog } from './TagParamInputGroupImportDialog';
import {
  TagParamInput,
  tagFieldNameFieldName,
  operatorFieldName,
  dataTypeFieldName,
  valueFieldName,
  tagIdFieldName,
  buildEmptyTagParamInputValue,
} from './TagParamInput';
import { LogicSwitch } from './LogicSwitch';
import { CONVERT_FUNC_MAP, convertForCascader } from '../../../base/tagRuleConvert';
import { convertDateValueForJsonEncode, convertDateValueForJsonDecode } from '../../../base/dateParamValueConvert';
import { TagParamInputChildren } from './TagParamInputChildren';
import './TagParam.css';

export const TagParamInputGroup = ({
  form,
  formItemName,
  allowSelectTag,
  disabled,
  tagMetaList,
  tagMetaListLoading,
  formListFields,
  formListRemove,
  formListAdd,
  allowNoAnyTagParamInput = true,
  globalLogicSwitchFormItemName,
  isEventPropertyParamsInput = false,
  eventId,
  isBehaviorParamInput = false,
  isUseAlphabetIndex = false,
  clearPackageSizePredictResult,
  oneLevelDirTagList,
  needCardBorder = false,
  importFieldsValue,
  importFieldsLevel,
  setImportFieldsLevel,
  paramType,
  setParamType,
  behaviorFieldIndex,
  importInitValue,
}: any) => {
  const showTagParamInputAddBtn = isFunction(formListAdd);
  const globalLogicSwitchValue = Form.useWatch(globalLogicSwitchFormItemName, form);
  const handleOnlyOneChildExist = useMemoizedFn(
    (tagParamInputGroupFormItemName, tagParamInputIndex, deleteTargetChildIndex) => {
      const tagParamInputFormItemName = [...tagParamInputGroupFormItemName, tagParamInputIndex];
      const theOnlyChildFormItemName = [...tagParamInputFormItemName, 'children', deleteTargetChildIndex === 0 ? 1 : 0];
      const theOnlyChildFieldValues = form.getFieldValue(theOnlyChildFormItemName);
      if (isNil(theOnlyChildFieldValues?.[tagIdFieldName])) {
        formListRemove(tagParamInputIndex);
      } else {
        form.setFieldValue(tagParamInputFormItemName, {
          ...theOnlyChildFieldValues,
          [tagFieldNameFieldName]: last(theOnlyChildFieldValues?.[tagFieldNameFieldName]),
          children: [],
          logicForChildren: 'AND',
        });
      }
      clearPackageSizePredictResult();
    },
  );
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  return (
    <div style={{ display: 'flex' }}>
      <LogicSwitch
        hidden={!globalLogicSwitchFormItemName || formListFields?.length < 2}
        value={globalLogicSwitchValue}
        type={isBehaviorParamInput ? 3 : 0}
        onChange={(newValue: string) => {
          if (disabled) {
            message.warning('当前状态不允许编辑');
            return;
          }
          form.setFieldValue(globalLogicSwitchFormItemName, newValue);
          clearPackageSizePredictResult();
        }}
      />
      <div style={{ flex: 1 }}>
        {isEmpty(formListFields) || isEmpty(tagMetaList)
          ? null
          : formListFields.map((field: any, fieldIndex: number) => {
              const fieldsValue = form.getFieldValue([...formItemName, field.name]);
              return (
                <Card
                  size='small'
                  type='inner'
                  id={isBehaviorParamInput ? 'tagparam_behave_card' : 'tagparam_card'}
                  bordered={needCardBorder}
                  key={field.key}
                  style={{
                    width: '100%',
                  }}
                >
                  {isEmpty(fieldsValue.children) ? (
                    <div style={{ flex: 1 }}>
                      <Tag
                        color='blue'
                        style={{
                          ...(disabled ? { verticalAlign: 'sub' } : {}),
                          alignSelf: 'center',
                        }}
                      >
                        {
                          // eslint-disable-next-line no-use-before-define
                          formatIndex(isUseAlphabetIndex, fieldIndex)
                        }
                      </Tag>
                      <TagParamInput
                        form={form}
                        formItemNamePrefixArr={formItemName}
                        index={field.name}
                        allowSelectTag={allowSelectTag}
                        disabled={disabled}
                        tagMetaList={tagMetaList}
                        tagMetaListLoading={tagMetaListLoading}
                        isEventPropertyParamsInput={isEventPropertyParamsInput}
                        eventId={eventId}
                      />
                      {!disabled && (
                        <Button
                          type='link'
                          onClick={() => {
                            if (!allowNoAnyTagParamInput && formListFields?.length === 1) {
                              message.warning('至少保留一项');
                              return;
                            }
                            formListRemove(field.name);
                          }}
                        >
                          <CloseCircleTwoTone />
                        </Button>
                      )}
                      {showTagParamInputAddBtn && !disabled && (
                        <Button type='link' className='link-btn' onClick={() => formListAdd(field.name)}>
                          <FilterOutlined />
                          添加筛选
                        </Button>
                      )}
                      {fieldsValue.dataType === 'STRING' && (
                        <Button
                          onClick={() => {
                            setParamType(paramType);
                            setImportDialogVisible(true);
                            if (paramType === 'tag') {
                              setImportFieldsLevel([field.name]);
                            } else {
                              setImportFieldsLevel([behaviorFieldIndex, field.name]);
                            }
                          }}
                          type='link'
                        >
                          <EditOutlined style={{ color: '#3da8f5' }} />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex' }}>
                      <Tag color='blue' style={{ alignSelf: 'center' }}>
                        {
                          // eslint-disable-next-line no-use-before-define
                          formatIndex(isUseAlphabetIndex, fieldIndex)
                        }
                      </Tag>
                      <LogicSwitch
                        value={fieldsValue?.logicForChildren}
                        type={1}
                        onChange={(newValue: string) => {
                          if (disabled) {
                            message.warning('当前状态不允许编辑');
                            return;
                          }
                          form.setFieldValue([...formItemName, field.name, 'logicForChildren'], newValue);
                          clearPackageSizePredictResult();
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <TagParamInputChildren
                          form={form}
                          setImportFieldsLevel={setImportFieldsLevel}
                          importFieldsLevel={importFieldsLevel}
                          setImportDialogVisible={setImportDialogVisible}
                          index={field.name}
                          formItemNamePrefixArr={formItemName}
                          formItemName={[field.name, 'children']}
                          allowSelectTag
                          disabled={disabled}
                          setParamType={setParamType}
                          paramType={paramType}
                          options={fieldsValue.children}
                          tagMetaList={tagMetaList}
                          tagMetaListLoading={tagMetaListLoading}
                          onOnlyOneChildExist={handleOnlyOneChildExist}
                          oneLevelDirTagList={oneLevelDirTagList}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
      </div>
      {importDialogVisible && (
        <TagParamInputGroupImportDialog
          importDialogVisible={importDialogVisible}
          setImportDialogVisible={setImportDialogVisible}
          form={form}
          paramType={paramType}
          tagMetaList={tagMetaList}
          importFieldsLevel={importFieldsLevel}
          submit={importFieldsValue}
          importInitValue={importInitValue}
        ></TagParamInputGroupImportDialog>
      )}
    </div>
  );
};
TagParamInputGroup.displayName = 'TagParamInputGroup';
TagParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat = (frontendFieldsValue: any) => {
  return map(
    frontendFieldsValue,
    ({ [dataTypeFieldName]: dataType, [valueFieldName]: originValue, children, ...restFields }) => {
      return {
        [dataTypeFieldName]: dataType,
        // eslint-disable-next-line no-use-before-define
        [valueFieldName]: handleTagParamInputFieldsValue(dataType, originValue),
        children: map(
          children,
          ({ [dataTypeFieldName]: childDataType, [valueFieldName]: childOriginValue, ...restChildFields }) => {
            return {
              [dataTypeFieldName]: childDataType,
              // eslint-disable-next-line no-use-before-define
              [valueFieldName]: handleTagParamInputFieldsValue(childDataType, childOriginValue),
              ...restChildFields,
            };
          },
        ),
        ...restFields,
      };
    },
  );

  function handleTagParamInputFieldsValue(dataType: string, originValue: string) {
    let finalValue = originValue;
    if (dataType === 'DATE') {
      finalValue = convertDateValueForJsonEncode(originValue) as string;
    }
    return finalValue;
  }
};
TagParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat = (layoutColumnFieldsValue: any) => {
  return map(
    layoutColumnFieldsValue,
    ({ [dataTypeFieldName]: dataType, [valueFieldName]: originValue, children, ...restFields }) => {
      return {
        [dataTypeFieldName]: dataType,
        // eslint-disable-next-line no-use-before-define
        [valueFieldName]: handleTagParamInputFieldsValue(dataType, originValue),
        children: map(
          children,
          ({ [dataTypeFieldName]: childDataType, [valueFieldName]: childOriginValue, ...restChildFields }) => {
            return {
              [dataTypeFieldName]: childDataType,
              // eslint-disable-next-line no-use-before-define
              [valueFieldName]: handleTagParamInputFieldsValue(childDataType, childOriginValue),
              ...restChildFields,
            };
          },
        ),
        ...restFields,
      };
    },
  );

  function handleTagParamInputFieldsValue(dataType: string, originValue: any) {
    let finalValue = originValue;
    if (dataType === 'DATE') {
      finalValue = convertDateValueForJsonDecode(originValue);
    }
    return finalValue;
  }
};
/* 后台接口参数格式参考：https://opc-mock.woa.com/project/553/interface/api/4975 */
TagParamInputGroup.convertFrontendFieldsValueToBackendFormat = (
  frontendFieldsValue: any,
  globalLogic: string,
  extraConfig = {},
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { backendIdFieldName = 'id' } = extraConfig;
  if (isEmpty(frontendFieldsValue)) return {};

  const items = map(frontendFieldsValue, (item) => {
    const {
      [dataTypeFieldName]: dataType,
      [valueFieldName]: originValue,
      [tagIdFieldName]: tagId,
      [operatorFieldName]: originOp,
      children,
      logicForChildren,
    } = item;

    if (isEmpty(children)) {
      // eslint-disable-next-line no-use-before-define
      return handleTagParamInputFieldsValue({
        tagId,
        originOp,
        dataType,
        originValue,
      });
    }
    return {
      logic: logicForChildren,
      items: map(children, (childItem) => {
        const {
          [dataTypeFieldName]: childDataType,
          [valueFieldName]: childOriginValue,
          [tagIdFieldName]: childTagId,
          [operatorFieldName]: childOriginOp,
        } = childItem;
        // eslint-disable-next-line no-use-before-define
        return handleTagParamInputFieldsValue({
          tagId: childTagId,
          originOp: childOriginOp,
          dataType: childDataType,
          originValue: childOriginValue,
        });
      }),
    };
  });

  return {
    logic: globalLogic,
    items,
  };

  function handleTagParamInputFieldsValue({ tagId, originOp, dataType, originValue }: any) {
    /* 根据数据类型获取相应的转换函数并执行 */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const convertFunc = CONVERT_FUNC_MAP[dataType];
    if (dataType === 'CASCADER') {
      return convertForCascader(tagId, originOp, originValue);
    }
    const { op, value } = convertFunc(originOp, originValue);

    return {
      [backendIdFieldName]: tagId,
      op,
      value: includes(['IS NULL', 'IS NOT NULL'], op) ? [] : value,
    };
  }
};
TagParamInputGroup.buildEmptyTagParamInputValue = buildEmptyTagParamInputValue;

export function useTagParamInputGroup({ tagMetaList, allowEmptyTag = false }: any) {
  const buildNewTagParamInputValue = useMemoizedFn((tagFieldName) => {
    if (!allowEmptyTag && !tagFieldName) {
      throw new Error('tagFieldName参数不能为空');
    }

    if (isString(tagFieldName) && tagFieldName) {
      const targetTagMeta = find(tagMetaList, { fieldName: tagFieldName });
      return {
        [tagIdFieldName]: targetTagMeta.tagId, // 仅用于方便debug
        [tagFieldNameFieldName]: tagFieldName,
        [dataTypeFieldName]: targetTagMeta.dataType, // 用于方便进行前端/后端/layout字段间的数据结构转换
        key: Date.now(),
        children: [],
        logicForChildren: 'AND',
      };
    }
    return buildEmptyTagParamInputValue();
  });

  return {
    buildNewTagParamInputValue,
  };
}

function formatIndex(isUseAlphabetIndex: boolean, fieldIndex: number) {
  if (!isUseAlphabetIndex) return fieldIndex + 1;
  const letterAChardCode = 97;
  return String.fromCharCode(fieldIndex + letterAChardCode);
}
