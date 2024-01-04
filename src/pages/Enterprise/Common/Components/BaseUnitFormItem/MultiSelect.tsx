import React from 'react';
import { Select } from 'antd';

export const MultiSelect = ({ className, disabled = false, value, optionList = [], width = 300, onChange }: any) => {
  return (
    <>
      <Select
        className={className}
        disabled={disabled}
        mode='tags'
        value={value}
        style={{ width }}
        allowClear
        onChange={onChange}
        options={optionList}
        maxTagCount={20}
        notFoundContent='此为模糊筛选，可尝试输入关键词或文本'
      />
    </>
  );
};
MultiSelect.displayName = 'MultiSelect';
