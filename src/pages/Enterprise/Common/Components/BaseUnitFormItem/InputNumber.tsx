import React from 'react';
import { InputNumber as AntdInputNumber } from 'antd';

export const InputNumber = ({ className, disabled = false, value, onChange }: any) => {
  const style: any = { width: 300 };
  if (className === 'has-error') {
    style.borderColor = '#f5222d';
  }

  return <AntdInputNumber style={style} disabled={disabled} value={value} onChange={onChange} />;
};
InputNumber.displayName = 'InputNumber';
