import React, { useState } from 'react';
import { trim, join, compact, split as lsplit } from 'lodash';
import { Select } from 'tdesign-react';
import { SelectValue } from 'tdesign-react/es/select';
import { ResQueryStaffParams } from 'types/clueTask.type';

/**
 * 员工姓名输入组件
 * @author : peytonfan
 */

export interface IFetchRes {
  eng_name: string;
  chn_name: string;
  [index: string]: any;
}

type IndexableResQueryStaffParams = { [P in keyof ResQueryStaffParams]?: string };

export type SearchFunc = (query: ResQueryStaffParams) => Promise<IFetchRes[]>;
export interface IStaffSelectProps {
  /**
   * @description 指定当前选中的条目，多选时为以分号(;)拼接的字符串,例如：'xiaowang;xiaoma'
   *
   */
  value?: string;
  /**
   * @description 分割符：仅在mode为'multiple'时有效
   * @default ;
   */
  split?: string;
  /**
   * @description 设置 Select 的模式为多选或标签
   * @default 'multiple';
   */
  multiple?: boolean;
  /**
   * @description 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 是否允许清空，同antd的Select组件
   * @default false
   */
  clearable?: boolean;
  /**
   * @description React原生style
   */
  style?: React.CSSProperties;
  /**
   * @description React原生className
   */
  className?: string;
  /**
   * @description 选择框默认文本
   * @default '请输入员工英文名';
   */
  placeholder?: string;
  // additionalOptions?: Array<{ name: string; value: string }>;
  /**
   * @description 选中 option，或 input 的 value 变化时，调用此函数
   */
  onChange?: (val: string) => void;
  /**
   * @description 文本框值变化时回调
   */
  onSearch?: (query: ResQueryStaffParams) => Promise<IFetchRes[]>;
}

interface IOption {
  label: string;
  value: string;
  cname: string;
}

export default function StaffSelect(props: IStaffSelectProps) {
  const {
    value = undefined,
    split = ';',
    multiple = false,
    placeholder = '请输入员工英文名或中文名',
    disabled = false,
    style = {},
    className = '',
    clearable = false,
    onChange = () => {},
    onSearch = () =>
      new Promise((resolve) => {
        resolve([]);
      }),
  } = props;

  const [options, setOptions] = useState<Array<IOption>>([]);

  /**
   * Search事件
   * @param _val：搜索的值
   */
  const handleSearch = (_val: string): void => {
    const val = trim(_val);
    const reg = /^[\u4e00-\u9fa5]+$|^(v_)?[a-zA-Z]+$|^(v_){1}$/; // 要么(全中文) 要么(全英文) 要么(v_全英文)  要么(v_) 注： 单独的v_也需触发搜索
    const zhReg = /^[\u4e00-\u9fa5]+$/;
    // 如果不满足上述正则表达式，直接就返回空，不发ajax请求
    if (!reg.test(val)) {
      setOptions([]);
    } else {
      const isZh = zhReg.test(val);
      const param: IndexableResQueryStaffParams = {};
      if (isZh) {
        param.NameZh = val;
      } else {
        param.Name = val;
      }
      onSearch(param).then((data: Array<IFetchRes>) => {
        const dataSource = data.map(({ eng_name: eName, chn_name: cName }) => ({
          label: `${eName}(${cName})`,
          value: eName,
          cname: cName,
        }));

        setOptions(dataSource);
      });
    }
  };
  /**
   * Change事件
   * @param val
   */
  const handleChange = (val: SelectValue) => {
    // eslint-disable-next-line no-unused-expressions
    if (multiple) {
      onChange(
        join(
          (val as string[]).map((v) => trim(v)),
          split,
        ),
      );
    } else {
      onChange(trim(val as string));
    }
  };
  const getValue = (value = '') => {
    // multiple时，value示例：'simon;andy:array',所以要转换为数组
    if (multiple) {
      return (!!value && compact(lsplit(value, split).map((v) => trim(v)))) || [];
    }
    return value || undefined;
  };
  // eslint-disable-next-line max-len
  // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false
  const handleFilterOption = (inputValue: string, option: any) => {
    const val = trim(inputValue).toUpperCase();
    return option.value.toUpperCase().indexOf(val) !== -1 || option.cname.toUpperCase().indexOf(val) !== -1;
  };

  return (
    <Select
      disabled={disabled}
      className={className}
      style={{ width: '100%', ...style }}
      // optionLabelProp='value'
      placeholder={placeholder}
      multiple={multiple}
      value={getValue(value)}
      filter={handleFilterOption}
      options={options}
      clearable={clearable}
      filterable={true}
      onSearch={handleSearch}
      onChange={handleChange}
    />
  );
}
StaffSelect.displayName = 'StaffSelect';
