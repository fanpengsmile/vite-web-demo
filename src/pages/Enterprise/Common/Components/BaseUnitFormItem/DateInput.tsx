import React from 'react';
import { DatePicker } from 'antd';

export const DateInput = ({ className, disabled = false, value, onChange }: any) => {
  // if (!!value && !moment.isMoment(value)) return null
  const style = { width: 300 };

  return <DatePicker className={className} style={style} disabled={disabled} value={value} onChange={onChange} />;
};
DateInput.displayName = 'DateInput';
