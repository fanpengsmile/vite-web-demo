import React from 'react';
import { Select, Cascader } from 'antd';

export const TagSelector = ({
  disabled = false,
  width = 289,
  options,
  optionsLoading,
  value,
  onChange,
  isCascader = false,
}: any) => {
  const commonProps = {
    style: { width },
    value,
    disabled,
    showSearch: true,
    loading: !!optionsLoading,
    onChange,
    options,
  };
  return isCascader ? (
    <Cascader {...commonProps} displayRender={(labels) => labels[labels.length - 1]} />
  ) : (
    <Select {...commonProps} />
  );
};
TagSelector.displayName = 'TagSelector';
