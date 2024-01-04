import React, { useRef, useEffect, useState } from 'react';
import { InputNumber, Select } from 'antd';
import { isNil, get, set } from 'lodash';
import { useMount } from 'ahooks';

const BEGIN_DATE_VALUE = 'unlimited_time'; // 最早时间/产品上线时间/不限时间
const DateType = {
  Today: 'today',
  Last: 'last',
  Future: 'future',
  Unlimited: 'unlimited_time',
};
export const RelativeDateRange = ({ className, disabled = false, value, onChange }: any) => {
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
    // eslint-disable-next-line no-return-assign
    return () => (valueRef.current = undefined);
  }, [value]);

  // 未来是负数，表格回显要为正数，取绝对值同时考虑undefined
  const startValue = isNil(get(value, 0, undefined)) ? get(value, 0, undefined) : Math.abs(get(value, 0));
  const endValue = isNil(get(value, 1, undefined)) ? get(value, 1, undefined) : Math.abs(get(value, 1));

  const [startDateType, setStartDateType] = useState('begin');
  const [endDateType, setEndDateType] = useState('last');

  const handleValueChange = (type: string, val: string | number | undefined, index: number) => {
    const newValue = [get(valueRef.current, 0, undefined), get(valueRef.current, 1, undefined)];
    if (type === 'begin') {
      set(newValue, index, BEGIN_DATE_VALUE);
    } else if (type === 'today') {
      set(newValue, index, val);
    } else {
      // 过去和未来
      const newVal = type === 'future' && !isNil(val) ? 0 - (val as number) : val;
      set(newValue, index, newVal);
    }
    onChange(newValue);
  };

  /**
   * 开始时间的change事件
   * @param type 'begin'|'today'|'last'|'future'
   */
  const handleStartDateTypeChange = (type: string) => {
    setStartDateType(type);
    if (type === 'begin') {
      handleValueChange(type, BEGIN_DATE_VALUE, 0);
    } else if (type === 'today') {
      handleValueChange(type, 'today', 0);
    } else {
      handleValueChange(type, undefined, 0);
    }
  };

  /**
   * 结束时间的change事件
   * @param type 'today'|'last'|'future'
   */
  const handleEndDateTypeChange = (type: string) => {
    setEndDateType(type);
    if (type === 'today') {
      handleValueChange(type, 'today', 1);
    } else {
      handleValueChange(type, undefined, 1);
    }
  };

  const inputStyle: any = { width: 70 };
  if (className === 'has-error') {
    inputStyle.borderColor = '#f5222d';
  }

  const ml = { marginLeft: 5 };
  const mr = { marginRight: 5 };
  const mrl = { marginLeft: 5, marginRight: 5, width: '100px' };

  /**
   * 根据val值获取dateType
   * @param val
   * @returns
   */
  const getDateType = (val: string | number) => {
    if (val === DateType.Unlimited) {
      return 'begin';
    }
    if (val === DateType.Today) {
      return 'today';
    }
    if ((val as number) < 0) {
      return 'future';
    }
    return 'last';
  };
  useMount(() => {
    if (isNil(value) || isNil(startValue) || isNil(endValue)) {
      /* 设置默认值 */
      onChange([BEGIN_DATE_VALUE, 1]);
    } else {
      /* 根据已保存数据设置起始时间类型 */
      setStartDateType(getDateType(value[0]));
      setEndDateType(getDateType(value[1]));
    }
  });

  return (
    <>
      <span style={mr}>自</span>
      <Select disabled={disabled} style={mrl} value={startDateType} onChange={handleStartDateTypeChange}>
        <Select.Option value='begin'>最早时间</Select.Option>
        <Select.Option value='today'>今天</Select.Option>
        <Select.Option value='last'>过去</Select.Option>
        <Select.Option value='future'>未来</Select.Option>
      </Select>
      {startDateType !== 'begin' && startDateType !== 'today' && (
        <>
          <InputNumber
            disabled={disabled}
            style={inputStyle}
            min={1}
            max={1001}
            value={startValue}
            onChange={(val) => handleValueChange(startDateType, val, 0)}
          />
          <span style={mrl}>天</span>
        </>
      )}
      <span style={mrl}>至</span>

      <Select disabled={disabled} style={mrl} value={endDateType} onChange={handleEndDateTypeChange}>
        <Select.Option value='today'>今天</Select.Option>
        <Select.Option value='last'>过去</Select.Option>
        <Select.Option value='future'>未来</Select.Option>
      </Select>
      {endDateType !== 'today' && (
        <>
          <InputNumber
            disabled={disabled}
            style={inputStyle}
            min={1}
            max={1001}
            value={endValue}
            onChange={(val) => handleValueChange(endDateType, val, 1)}
          />
          <span style={mrl}>天</span>
        </>
      )}

      <span style={ml}>之间</span>
    </>
  );
};
RelativeDateRange.displayName = 'DynamicDateRange';
