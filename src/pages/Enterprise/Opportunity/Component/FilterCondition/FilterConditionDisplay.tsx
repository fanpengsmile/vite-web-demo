import React from 'react';
import { Tag, Form, Typography, Button } from 'antd';
import {
  keywordSearchSelectOptions,
  formFieldsRenderedAsCheckboxGroup,
  formFieldsRenderedAsSelect,
  customOptionValue,
  formFieldNameForOneCheckboxGroup,
} from '../../config';
import { tagMeta } from '../../../base/cgi';
import { getLabelFromOptionList } from '../../../Common/util';
import { concat, isFunction, map, isEmpty, find, join, filter, some } from 'lodash';
import { useUpdateEffect, useMemoizedFn } from 'ahooks';

export function FilterConditionDisplay({
  optionSelectForm,
  keywordSearchForm,
  keywordSearchParams,
  optionSelectParams,
  setKeywordSearchParams,
  setOptionSelectParams,
  afterClearAllParams,
  afterClearOneParam,
}: any) {
  const optionTypeFieldNameList = concat(formFieldsRenderedAsCheckboxGroup, formFieldsRenderedAsSelect);
  // eslint-disable-next-line no-use-before-define
  const isShowKeywordSearchTag = judgeIsShowKeywordSearchTag(keywordSearchParams);
  // eslint-disable-next-line no-use-before-define
  const isShowDistrictTag = judgeIsShowRelateTag('district', optionSelectParams);
  // eslint-disable-next-line no-use-before-define
  const isShowIndustryTag = judgeIsShowRelateTag('industry', optionSelectParams);
  // eslint-disable-next-line no-use-before-define
  const isShowStartDateTag = judgeIsShowStartDateTag(optionSelectParams);
  // eslint-disable-next-line no-use-before-define
  const isShowOptionTags = judgeIsShowOptionTags(optionSelectParams, optionTypeFieldNameList as any);
  // eslint-disable-next-line no-use-before-define
  const isShowOneCheckboxButtonGroupTags = judgeIsShowOneCheckboxButtonGroupTags(optionSelectParams);
  const isShowAllClearButton =
    isShowKeywordSearchTag ||
    isShowDistrictTag ||
    isShowIndustryTag ||
    isShowStartDateTag ||
    isShowOptionTags ||
    isShowOneCheckboxButtonGroupTags;

  useUpdateEffect(() => {
    if (isFunction(afterClearAllParams) && !isShowAllClearButton) {
      afterClearAllParams();
    }
  }, [isShowAllClearButton]);

  return (
    <Form
      labelCol={{
        style: { width: '100px' },
      }}
      labelAlign='left'
    >
      <Form.Item label='已选条件' style={{ marginBottom: '5px' }}>
        {isShowKeywordSearchTag &&
          // eslint-disable-next-line no-use-before-define
          renderKeywordSearchTag(keywordSearchParams, keywordSearchForm, setKeywordSearchParams, afterClearOneParam)}
        {isShowDistrictTag && (
          // eslint-disable-next-line no-use-before-define
          <RelateTag
            fieldValue={optionSelectParams?.district}
            fieldName='district'
            fieldCnName='所在地区'
            optionSelectForm={optionSelectForm}
            setOptionSelectParams={setOptionSelectParams}
            afterClearOneParam={afterClearOneParam}
          />
        )}
        {isShowIndustryTag && (
          // eslint-disable-next-line no-use-before-define
          <RelateTag
            fieldValue={optionSelectParams?.industry}
            fieldName='industry'
            fieldCnName='所属行业'
            optionSelectForm={optionSelectForm}
            setOptionSelectParams={setOptionSelectParams}
            afterClearOneParam={afterClearOneParam}
          />
        )}
        {isShowOptionTags &&
          map(optionTypeFieldNameList, (fieldName) => (
            // eslint-disable-next-line no-use-before-define
            <OptionTag
              key={fieldName}
              fieldValue={optionSelectParams?.[fieldName]}
              fieldName={fieldName}
              optionSelectForm={optionSelectForm}
              setOptionSelectParams={setOptionSelectParams}
              afterClearOneParam={afterClearOneParam}
            />
          ))}
        {isShowStartDateTag && (
          // eslint-disable-next-line no-use-before-define
          <StartDateTag
            optionSelectParams={optionSelectParams}
            optionSelectForm={optionSelectForm}
            setOptionSelectParams={setOptionSelectParams}
            afterClearOneParam={afterClearOneParam}
          />
        )}
        {isShowOneCheckboxButtonGroupTags ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-nocheck
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-use-before-define
          <OneCheckboxButtonGroupTags
            optionSelectParams={optionSelectParams}
            optionSelectForm={optionSelectForm}
            setOptionSelectParams={setOptionSelectParams}
            afterClearOneParam={afterClearOneParam}
          />
        ) : null}
        {isShowAllClearButton && (
          // eslint-disable-next-line no-use-before-define
          <AllClearButton
            keywordSearchForm={keywordSearchForm}
            setKeywordSearchParams={setKeywordSearchParams}
            optionSelectForm={optionSelectForm}
            setOptionSelectParams={setOptionSelectParams}
          />
        )}
      </Form.Item>
    </Form>
  );

  function renderKeywordSearchTag(
    keywordSearchParams: {
      keywordSearchType: string;
      keywordSearchValue: string;
    },
    keywordSearchForm: any,
    setKeywordSearchParams: any,
    afterClearOneParam: any,
  ) {
    const { keywordSearchType, keywordSearchValue } = keywordSearchParams || {};

    const clearKeywordSearchParams = () => {
      keywordSearchForm.resetFields();
      setKeywordSearchParams({});
      afterClearOneParam();
    };

    return (
      <Tag key='keywordSearchTag' closable onClose={clearKeywordSearchParams}>
        {getLabelFromOptionList(keywordSearchSelectOptions, keywordSearchType)}：
        <Typography.Text strong>{keywordSearchValue}</Typography.Text>
      </Tag>
    );
  }
}
FilterConditionDisplay.displayName = 'FilterConditionDisplay';

function OptionTag({ fieldValue, fieldName, optionSelectForm, setOptionSelectParams, afterClearOneParam }: any) {
  if (isEmpty(fieldValue)) {
    return null;
  }

  const clearParams = () => {
    optionSelectForm.resetFields([fieldName]);
    setOptionSelectParams((params: any) => ({ ...params, [fieldName]: undefined }));
    afterClearOneParam();
  };

  const targetTag = find(tagMeta, { field_name: fieldName });

  return (
    <Tag key={fieldName} closable onClose={clearParams}>
      {targetTag?.field_cn_name}：<Typography.Text strong>{join(fieldValue, ' or ')}</Typography.Text>
    </Tag>
  );
}

function RelateTag({
  fieldValue,
  fieldName,
  fieldCnName,
  optionSelectForm,
  setOptionSelectParams,
  afterClearOneParam,
}: any) {
  const clearParams = () => {
    optionSelectForm.resetFields([fieldName]);
    setOptionSelectParams((params: any) => ({ ...params, [fieldName]: undefined }));
    afterClearOneParam();
  };
  return (
    <Tag key={fieldName} closable onClose={clearParams}>
      {fieldCnName}：
      <Typography.Text strong>
        {
          // eslint-disable-next-line no-use-before-define
          renderRelateTagFieldValue(fieldValue)
        }
      </Typography.Text>
    </Tag>
  );

  function renderRelateTagFieldValue(fieldValue: []) {
    return fieldValue.map((item: Array<string>) => item[item.length - 1]).join(' | ');
  }
}

function StartDateTag({ optionSelectParams, optionSelectForm, setOptionSelectParams, afterClearOneParam }: any) {
  const { start_day_level: startDayLevel, start_date: startDate } = optionSelectParams;
  const clearParams = () => {
    optionSelectForm.resetFields(['start_day_level', 'start_date']);
    setOptionSelectParams((params: {}) => ({
      ...params,
      start_day_level: undefined,
      start_date: undefined,
    }));
    afterClearOneParam();
  };
  return (
    <Tag closable onClose={clearParams}>
      成立时间：
      <Typography.Text strong>
        {
          // eslint-disable-next-line no-use-before-define
          renderFieldValue(startDayLevel, startDate)
        }
      </Typography.Text>
    </Tag>
  );

  function renderFieldValue(startDayLevel: string[], startDate: any): string | null {
    let result: string | (string | null)[] = startDayLevel.map((startDayLevelValue) => {
      if (startDayLevelValue === customOptionValue) {
        if (isEmpty(startDate)) return null;
        return `${startDate[0].format('YYYY-MM-DD')}~${startDate[1].format('YYYY-MM-DD')}`;
      }
      return startDayLevelValue;
    });

    // eslint-disable-next-line no-return-assign
    return (result = result.filter((value) => value !== null).join('|'));
  }
}

function AllClearButton({ keywordSearchForm, setKeywordSearchParams, optionSelectForm, setOptionSelectParams }: any) {
  const clearAllParams = () => {
    keywordSearchForm.resetFields();
    setKeywordSearchParams({});
    optionSelectForm.resetFields();
    setOptionSelectParams({});
  };
  return (
    <Button size='small' onClick={clearAllParams}>
      清空
    </Button>
  );
}

function OneCheckboxButtonGroupTags({
  optionSelectParams,
  optionSelectForm,
  setOptionSelectParams,
  afterClearOneParam,
}: any) {
  const clearParams = useMemoizedFn((targetFieldName) => {
    const newFormFieldValueAfterClear = filter(
      optionSelectParams?.[formFieldNameForOneCheckboxGroup],
      (fieldName) => fieldName !== targetFieldName,
    );
    setOptionSelectParams((params: any) => ({
      ...params,
      [formFieldNameForOneCheckboxGroup]: newFormFieldValueAfterClear,
    }));
    optionSelectForm.setFieldValue(formFieldNameForOneCheckboxGroup, newFormFieldValueAfterClear);
    afterClearOneParam();
  });

  return map(optionSelectParams?.[formFieldNameForOneCheckboxGroup], (fieldName) => {
    const targetTag = find(tagMeta, { field_name: fieldName });
    return (
      <Tag
        key={fieldName}
        closable
        onClose={() => {
          clearParams(fieldName);
        }}
      >
        {targetTag?.field_cn_name}：<Typography.Text strong>是</Typography.Text>
      </Tag>
    );
  });
}

function judgeIsShowKeywordSearchTag(keywordSearchParams: { keywordSearchType: string; keywordSearchValue: string }) {
  const { keywordSearchType, keywordSearchValue } = keywordSearchParams || {};
  // if (!keywordSearchType || !keywordSearchValue) return null
  return !!keywordSearchType && !!keywordSearchValue;
}

function judgeIsShowRelateTag(fieldName: string, optionSelectParams: any) {
  return !isEmpty(optionSelectParams?.[fieldName]);
}

function judgeIsShowStartDateTag(optionSelectParams: any) {
  const { start_day_level: startDayLevel, start_date: startDate } = optionSelectParams;
  if (isEmpty(startDayLevel)) {
    return false;
  }
  if (startDayLevel.length === 1 && startDayLevel[0] === customOptionValue && isEmpty(startDate)) {
    return false;
  }
  return true;
}

function judgeIsShowOptionTags(optionSelectParams: any, fieldNameList: []) {
  return some(fieldNameList, (fieldName) => {
    const fieldValue = optionSelectParams?.[fieldName];
    return !isEmpty(fieldValue);
  });
}

function judgeIsShowOneCheckboxButtonGroupTags(optionSelectParams: any) {
  return !isEmpty(optionSelectParams?.[formFieldNameForOneCheckboxGroup]);
}
