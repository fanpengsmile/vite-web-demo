import React from 'react';
import { Button, Space } from 'antd';
import { includes, filter, isEmpty, map } from 'lodash';

export function CheckboxButtonGroup({ className, value: checkedValueList, onChange, options, isCompact }: any) {
  const SpaceComponent = isCompact ? Space.Compact : Space;

  const handleButtonClick = (valueOfOption: string) => {
    if (includes(checkedValueList, valueOfOption)) {
      onChange(filter(checkedValueList, (value) => value !== valueOfOption));
    } else {
      onChange([...checkedValueList, valueOfOption]);
    }
  };

  if (isEmpty(options)) return null;
  if (options.length > 8) {
    return (
      <>
        <SpaceComponent className={className}>
          {map(options.slice(0, 8), ({ value: valueOfOption, label }) => {
            const type = includes(checkedValueList, valueOfOption) ? 'primary' : 'default';
            return (
              <Button
                key={valueOfOption}
                type={type}
                style={{
                  width: '100px',
                  paddingLeft: '1px',
                  paddingRight: '1px',
                }}
                onClick={() => {
                  handleButtonClick(valueOfOption);
                }}
              >
                {label}
              </Button>
            );
          })}
        </SpaceComponent>
        <SpaceComponent className={className} style={{ display: 'flex', marginTop: '2px' }}>
          {map(options.slice(8, options.length), ({ value: valueOfOption, label }) => {
            const type = includes(checkedValueList, valueOfOption) ? 'primary' : 'default';
            const maxLen = label.length > 7;
            return (
              <Button
                key={valueOfOption}
                type={type}
                style={{
                  width: maxLen ? '150px' : '100px',
                  paddingLeft: '1px',
                  paddingRight: '1px',
                }}
                onClick={() => {
                  handleButtonClick(valueOfOption);
                }}
              >
                {label}
              </Button>
            );
          })}
        </SpaceComponent>
      </>
    );
  }
  return (
    <SpaceComponent className={className}>
      {map(options, ({ value: valueOfOption, label }) => {
        const type = includes(checkedValueList, valueOfOption) ? 'primary' : 'default';
        return (
          <Button
            key={valueOfOption}
            type={type}
            style={{
              width: '100px',
              paddingLeft: '1px',
              paddingRight: '1px',
            }}
            onClick={() => {
              handleButtonClick(valueOfOption);
            }}
          >
            {label}
          </Button>
        );
      })}
    </SpaceComponent>
  );
}
CheckboxButtonGroup.displayName = 'CheckboxButtonGroup';
