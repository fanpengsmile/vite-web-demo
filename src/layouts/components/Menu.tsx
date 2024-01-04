import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'tdesign-react';
import router, { IRouter } from 'router';
import { resolvePath } from 'utils/path';
import MenuLogo from './MenuLogo';
import Style from './Menu.module.less';
import { useStore } from 'store';

const { SubMenu, MenuItem } = Menu;

interface IMenuProps {
  showLogo?: boolean;
  showOperation?: boolean;
}

const renderMenuItems = (menu: IRouter[], parentPath = '') => {
  const navigate = useNavigate();
  return menu.map((item) => {
    const { children, meta, path } = item;

    if (!meta || meta?.hidden === true) {
      // 无meta信息 或 hidden == true，路由不显示为菜单
      return null;
    }

    const { Icon, title, single, nav } = meta;
    const routerPath = resolvePath(parentPath, path);
    // 没有children的情况
    if (!children || children.length === 0) {
      return (
        <MenuItem
          key={routerPath}
          value={routerPath}
          icon={Icon ? <Icon /> : undefined}
          onClick={() => navigate(routerPath)}
        >
          {title}
        </MenuItem>
      );
    }
    // 其他情况
    return (
      <SubMenu key={routerPath} value={routerPath} title={title} icon={Icon ? <Icon /> : undefined}>
        {renderMenuItems(children, routerPath)}
      </SubMenu>
    );
  });
};

/**
 * 左侧菜单
 */
export default memo((props: IMenuProps) => {
  const location = useLocation();
  const menuCollapsed = useStore((state) => state.menuCollapsed);
  const bottomText = menuCollapsed ? '0.0.1' : `内部使用`;

  return (
    <Menu
      width='232px'
      style={{ flexShrink: 0, height: '100%' }}
      value={location.pathname}
      collapsed={menuCollapsed}
      operations={props.showOperation ? <div className={Style.menuTip}>{bottomText}</div> : undefined}
      logo={props.showLogo ? <MenuLogo collapsed={menuCollapsed} /> : undefined}
    >
      {renderMenuItems(router)}
    </Menu>
  );
});
