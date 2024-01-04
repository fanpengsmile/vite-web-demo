import React from 'react';
import { isEmpty, get, filter, includes } from 'lodash';
import { Select } from 'antd';
import { useMemoizedFn } from 'ahooks';

/* 针对不同数据类型的条件所支持的操作符列表 */
export const DATA_TYPE_OPERATOR_MAP = {
  STRING: ['=', '<>', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'],
  CASCADER: ['=', '<>'],
  DOUBLE: ['=', '<>', '>', '<', '>=', '<=', 'IS NULL', 'IS NOT NULL', 'BETWEEN'],
  // DOUBLE_VALUE: ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN'], // 后台数据并无此数据类型，专供EventAggrInput组件使用，目的是为了区分开不同的操作符范围
  DATE: [
    '=',
    '<>',
    '>',
    '<',
    '>=',
    '<=',
    'IS NULL',
    'IS NOT NULL',
    'BETWEEN STATIC TIME',
    'BETWEEN DYNAMIC TIME',
    'RECENT',
  ],
  BOOL: ['='],
};
/* 操作符选项列表 */
export const OPERATOR_OPTION_LIST = [
  { label: '相对时间', value: 'RECENT' },
  { label: '相对时间段', value: 'BETWEEN DYNAMIC TIME' },
  { label: '固定时间段', value: 'BETWEEN STATIC TIME' },
  { label: '区间', value: 'BETWEEN' },
  { label: '等于', value: '=' },
  { label: '不等于', value: '<>' },
  { label: '大于', value: '>' },
  { label: '小于', value: '<' },
  { label: '大于等于', value: '>=' },
  { label: '小于等于', value: '<=' },
  // { label: '是', value: 'true' },
  // { label: '否', value: 'false' },
  { label: '包含', value: 'IN' },
  { label: '不包含', value: 'NOT IN' },
  { label: '为空', value: 'IS NULL' },
  { label: '不为空', value: 'IS NOT NULL' },
];

/* 不需要清空value的操作符白名单 */
// const NO_NEED_CLEAR_VALUE_OPERATOR_LIST = [
//   '=',
//   '<>',
//   '>',
//   '<',
//   '>=',
//   '<=',
//   'IN',
//   'NOT IN',
// ]

export const OperatorSelector = ({
  disabled = false,
  value: op,
  onChange,
  dataType,
  availableList,
  clearValueFunc,
}: any) => {
  const operatorList = isEmpty(availableList) ? get(DATA_TYPE_OPERATOR_MAP, dataType, []) : availableList;
  const operatorOptionList = filter(OPERATOR_OPTION_LIST, (option) => includes(operatorList, option.value));

  const handleSelectChange = useMemoizedFn((newOp) => {
    /*
        部分操作符变动的话，需要清空value，避免数据结构造成表单组件报错
        这边的op指的是变动前的操作符，newOp则是变动后的操作符
      */
    // if (
    //   !includes(NO_NEED_CLEAR_VALUE_OPERATOR_LIST, op) &&
    //   includes(NO_NEED_CLEAR_VALUE_OPERATOR_LIST, newOp)
    // ) {
    clearValueFunc();
    // }
    onChange(newOp);
  });

  return (
    <Select
      style={{ width: 120 }}
      disabled={disabled}
      value={op}
      onChange={handleSelectChange}
      options={operatorOptionList}
    />
  );
};
OperatorSelector.displayName = 'OperatorSelector';
OperatorSelector.getFirstOperator = (dataType: string) => {
  if (!dataType) return undefined;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return DATA_TYPE_OPERATOR_MAP[dataType]?.[0];
};
