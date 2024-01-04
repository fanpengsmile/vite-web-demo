import React from 'react';
import { map } from 'lodash';
import styles from '../../../base/styles.module.css';

const LOGIC_OPTIONS = [
  { value: 'AND', label: '且' },
  { value: 'OR', label: '或' },
];

export const LogicSwitch = ({ hidden = false, disabled = false, value, onChange, type }: any) => {
  return (
    <div
      className={`${styles['logic-switch']} ${hidden ? '' : styles['logic-switch-has-line']}`}
      style={{
        // eslint-disable-next-line no-nested-ternary
        marginBottom: type === 1 || type === 3 ? '5px' : type === 2 ? '10px' : '',
        // eslint-disable-next-line no-nested-ternary
        paddingBottom: type === 1 ? '20px' : type === 3 || type === 0 ? '15px' : '',
        marginTop: type === 3 ? '10px' : '',
      }}
    >
      {!hidden &&
        map(LOGIC_OPTIONS, ({ value: optionValue, label }) => (
          <div
            key={optionValue}
            className={`${styles['logic-switch__btn-logic']}${
              value === optionValue ? ` ${styles['logic-switch__btn-logic--selected']}` : ''
            }`}
            onClick={() => !disabled && onChange(optionValue)}
          >
            {label}
          </div>
        ))}
    </div>
  );
};
LogicSwitch.displayName = 'LogicSwitch';
