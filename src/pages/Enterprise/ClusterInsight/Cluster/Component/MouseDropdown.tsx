import React, { useState } from 'react';
import { Menu, Dropdown, Tooltip } from 'antd';
import { map, delay } from 'lodash';
import { useBoolean, useClickAway } from 'ahooks';
import { InfoCircleOutlined } from '@ant-design/icons';

function useVisibleLock() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { state: lock, setTrue, setFalse } = useBoolean(false);

  return {
    lock,
    setLock() {
      setTrue();
      delay(setFalse, 100);
    },
  };
}

export default function MouseDropdown(props: any) {
  const { position, mouseDropdownVisible, hideMouseDropdown, menuData } = props;
  const { clientX, clientY } = position;
  const overlayStyle = {
    position: 'fixed',
    left: clientX,
    top: clientY,
  };
  useClickAway(
    () => {
      if (mouseDropdownVisible) hideMouseDropdown();
    },
    () => document.getElementById('mouse-dropdown'),
  );
  const menu = (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Menu style={overlayStyle} id='mouse-dropdown'>
      {map(menuData, (menu) => (
        <>
          <Menu.Item style={{ margin: 5 }} key={menu.name} onClick={menu.onClick}>
            {menu.name}
            {menu.key === 'detail' ? null : (
              <Tooltip title='使用Shift键进行多选'>
                <InfoCircleOutlined style={{ marginLeft: '3px' }} />
              </Tooltip>
            )}
          </Menu.Item>
        </>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} visible={mouseDropdownVisible}>
      <div />
    </Dropdown>
  );
}
MouseDropdown.displayName = 'MouseDropdown';

export function useMouseDropdown() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { state: mouseDropdownVisible, setTrue, setFalse } = useBoolean();
  const [position, setPosition] = useState({ clientX: 0, clientY: 0 });
  const { lock, setLock } = useVisibleLock();
  return {
    mouseDropdownVisible,
    showMouseDropdown(position: { clientX: number; clientY: number }) {
      setPosition(position);
      setTrue();
      setLock();
    },
    hideMouseDropdown() {
      if (!lock) {
        setFalse();
      }
    },
    position,
  };
}
