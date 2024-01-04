import React from 'react';
import { Cascader } from 'antd';
import styles from './styles.module.css';

export const CascaderSelect = ({ disabled, width = 300, optionList = [], value, onChange, placeholder }: any) => {
  return (
    <Cascader
      style={{ width }}
      popupClassName={styles['cascader-popup']}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={optionList}
      multiple
      showSearch
      allowClear
      placeholder={placeholder}
      showCheckedStrategy={Cascader.SHOW_PARENT}
      maxTagCount={20}
    />
  );
};
CascaderSelect.displayName = 'CascaderSelect';
