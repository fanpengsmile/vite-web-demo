import React, { useRef, useEffect } from 'react';
import { InputNumber } from 'antd';
import { get, set } from 'lodash';

export const InputNumberRange = ({ className, disabled = false, value, onChange }: any) => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
    // eslint-disable-next-line no-return-assign
    return () => (valueRef.current = undefined);
  }, [value]);
  const handleChange = (val: string, index: number) => {
    const newValue = [get(valueRef.current, 0, undefined), get(valueRef.current, 1, undefined)];
    set(newValue, index, val);
    onChange(newValue);
  };

  const style: any = { width: 139 };
  if (className === 'has-error') {
    style.borderColor = '#f5222d';
  }

  return (
    <>
      <InputNumber
        disabled={disabled}
        style={style}
        value={get(value, 0, undefined)}
        onChange={(val) => handleChange(val, 0)}
      />
      <span style={{ margin: '0 5px' }}>与</span>
      <InputNumber
        disabled={disabled}
        style={style}
        value={get(value, 1, undefined)}
        onChange={(val) => handleChange(val, 1)}
      />
      <span style={{ marginLeft: 5 }}>之间</span>
    </>
  );
};
InputNumberRange.displayName = 'InputNumberRange';
