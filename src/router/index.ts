import React from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import enterprise from './modules/enterprise';

interface IBreadcrumbItem {
  content: string;
  to?: string;
}

export interface IRouterMeta {
  title?: string;
  Icon?: React.FC;
  mode?: string;
  /**
   * 侧边栏隐藏该路由
   */
  hidden?: boolean;
  /**
   * 单层路由
   */
  single?: boolean;
  nav?: string;
  breadcrumb?: string | IBreadcrumbItem[];
  hasHorizontalMenu?: boolean;
  isPage?: boolean;
  horizontalMenuPath?: string;
  isFlex?: boolean;
  flexDirection?: 'column' | 'row';
  taskType?: string;
  need_pv_report?: boolean;
  level1_module?: string;
  level2_module?: string;
  level3_module?: string;
}

export interface IRouter {
  isHideWatermark?: boolean; // 单独屏蔽某页面的防盗水印
  path: string;
  redirect?: string;
  Component?: React.FC<BrowserRouterProps | { meta: IRouterMeta; }> | (() => any);
  /**
   * 当前路由是否全屏显示
   */
  isFullPage?: boolean;
  /**
   * meta未赋值 路由不显示到菜单中
   */
  meta?: IRouterMeta;
  isRemoveLayoutGap?: boolean; // 主要给嵌入CEM的局部页面移除layout gap使用，按需配置。
  children?: IRouter[];
}

const routes: IRouter[] = [
  // {
  //   path: '/login',
  //   Component: lazy(() => import('pages/Login')),
  //   isFullPage: true,
  //   meta: {
  //     hidden: true,
  //   },
  // },
  {
    path: '/',
    redirect: '/enterprise/opportunity/list',
  },
];

const allRoutes = [...routes, ...enterprise];

export default allRoutes;
