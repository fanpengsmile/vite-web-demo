import React from 'react';
import { map } from 'lodash';
import { Select } from 'antd';

const BOOL_OPTIONS_LIST = ['是', '否'];
export const BoolSelect = ({ disabled = false, value, width = 300, className, onChange }: any) => {
  return (
    <Select className={className} disabled={disabled} value={value} style={{ width }} onChange={onChange}>
      {map(BOOL_OPTIONS_LIST, (option) => (
        <Select.Option value={option} key={option} title={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};
BoolSelect.displayName = 'BoolSelect';
