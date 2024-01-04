import React from 'react';
import { Select } from 'antd';
import { map } from 'lodash';
import { DYNAMIC_DATE_SHORTCUT_OPTIONS_LIST } from '../../../base/dateParamValueConvert';

export const DynamicDateShortcut = ({ disabled = false, value, width = 300, className, onChange }: any) => {
  return (
    <Select className={className} disabled={disabled} value={value} style={{ width }} onChange={onChange}>
      {map(DYNAMIC_DATE_SHORTCUT_OPTIONS_LIST, ({ label, value }) => (
        <Select.Option value={value} key={value} title={label}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};
DynamicDateShortcut.displayName = 'DynamicDateShortcut';
