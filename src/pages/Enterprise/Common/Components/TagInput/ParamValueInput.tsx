import React from 'react';
import {
  BoolSelect,
  InputNumber,
  InputNumberRange,
  DateInput,
  DateRange,
  DynamicDateShortcut,
  MultiSelect,
  CascaderSelect,
  RelativeDateRange,
} from '../BaseUnitFormItem';
import { includes } from 'lodash';

const paramValueNotRequiredByOperatorValueList = ['IS NULL', 'IS NOT NULL'];

export const ParamValueInput = ({
  disabled = false,
  dataType,
  operatorValue,
  value,
  tagAvailableValueOptionList,
  tagAvailableValueOptionListLoading,
  onChange,
}: any) => {
  const commonProps = { disabled, value, onChange };

  if (!ParamValueInput.judgeIsRequired(operatorValue)) {
    return null;
  }
  switch (dataType) {
    case 'BOOL':
      if (operatorValue === '=') {
        return <BoolSelect {...commonProps} />;
      }
      return null;
    case 'CASCADER':
      return (
        <CascaderSelect
          {...commonProps}
          optionList={tagAvailableValueOptionList}
          optionListLoading={tagAvailableValueOptionListLoading}
        />
      );
    case 'STRING':
      return (
        <MultiSelect
          {...commonProps}
          optionList={tagAvailableValueOptionList}
          optionListLoading={tagAvailableValueOptionListLoading}
        />
      );
    case 'DOUBLE':
    case 'DOUBLE_VALUE': // 后台数据并无此数据类型，专供EventAggrInput组件使用
      if (includes(['=', '<>', '>', '<', '>=', '<='], operatorValue)) {
        return <InputNumber {...commonProps} />;
      }
      if (operatorValue === 'BETWEEN') {
        return <InputNumberRange {...commonProps} />;
      }
      return null;
    case 'DATE': {
      /* 静态时间 */
      if (includes(['=', '<>', '>', '<', '>=', '<='], operatorValue)) {
        return <DateInput {...commonProps} />;
      }
      switch (operatorValue) {
        case 'BETWEEN STATIC TIME': // 固定时间段
          return <DateRange {...commonProps} />;
        case 'RECENT': // 相对时间
          return <DynamicDateShortcut {...commonProps} />;
        case 'BETWEEN DYNAMIC TIME': // 相对时间段
          return <RelativeDateRange {...commonProps} />;
        default:
          return null;
      }
      return null;
    }
    default:
      return null;
  }
};
ParamValueInput.displayName = 'ParamValueInput';
ParamValueInput.judgeIsRequired = (operatorValue: string) => {
  return !includes(paramValueNotRequiredByOperatorValueList, operatorValue);
};
