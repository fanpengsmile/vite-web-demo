import React, { Suspense, memo, useMemo } from 'react';
import { useRoutes, useLocation, RouteObject, Navigate } from 'react-router-dom';
import { Layout, Loading } from 'tdesign-react';
import routers, { IRouter } from 'router';
import { resolvePath } from 'utils/path';
import Page from './Page';
import Style from './AppRouter.module.less';
import BreadCrumb from './BreadCrumb';
import WatermarkWrap from 'components/WatermarkWrap';

const { Content } = Layout;

/**
 * 渲染应用路由
 * @param routes
 * @param parentPath
 * @param breadcrumb
 */
const renderRoutes = (routes: IRouter[], parentPath = '') =>
  routes.map((route) => {
    const { Component, children, redirect, meta = {} } = route;
    const currentPath = resolvePath(parentPath, route.path);

    // let currentBreadcrumb = breadcrumb;
    let currentBreadcrumb: { content: string; to?: string }[] = [];

    if (meta?.hidden && meta?.title && meta?.breadcrumb) {
      if (Array.isArray(meta?.breadcrumb)) {
        currentBreadcrumb = meta?.breadcrumb;
      } else {
        currentBreadcrumb = [{ content: meta?.breadcrumb }];
      }
      currentBreadcrumb.push({ content: meta?.title });
    }
    const info: RouteObject = {
      path: route.path,
      // key: route.path + '##',
    };
    if (Component) {
      if (parentPath === '') {
        if (route?.isRemoveLayoutGap) {
          info.element = <Component meta={meta} />;
        } else {
          // 有Component并且parentPath还是空的，说明这个是根级页面
          info.element = (
            <Page isFlex={meta?.isFlex} flexDirection={meta?.flexDirection}>
              {route?.isHideWatermark ? (
                <Component meta={meta} />
              ) : (
                <WatermarkWrap>
                  <Component meta={meta} />
                </WatermarkWrap>
              )}
            </Page>
          );
        }
      } else if (!routers.find((i) => i.path === parentPath)?.Component) {
        // 或者父级Component为空，那么当前自己就是根级页面(严格来说这里要递归调用，介于目前只有2级，暂时如此)
        info.element = (
          <Page isFlex={meta?.isFlex} flexDirection={meta?.flexDirection}>
            <WatermarkWrap>
              <BreadCrumb breadcrumbs={currentBreadcrumb} />
              <Component meta={meta} />
            </WatermarkWrap>
          </Page>
        );
      } else {
        info.element = (
          <>
            <BreadCrumb breadcrumbs={currentBreadcrumb} />
            <Component />
          </>
        );
      }
    }
    if (redirect) {
      info.element = <Navigate to={redirect} />;
    }
    if (children) {
      info.children = renderRoutes(children, currentPath);
    }
    return info;
  });

const findNodeByPath = (curPath: string, routes: IRouter[]) => {
  const pathArr = curPath.split('/').filter((i) => i !== '');
  function findNode(node: IRouter[], pathArray: string[]) {
    const key = pathArray.shift();
    const childNode = node.find((item) => item.path === `/${key}` || item.path === `${key}`);

    if (pathArray.length === 0 && childNode) {
      return childNode;
    }
    if (childNode && childNode.children) {
      return findNode(childNode.children, pathArray);
    }
    return null;
  }
  return findNode(routes, [...pathArr]);
};

const AppRouter = () => {
  const currentRoutes = useMemo(() => renderRoutes(routers), [routers]);
  const location = useLocation();

  const currentNode = findNodeByPath(location.pathname, routers);

  const GetRoutes = () => {
    return useRoutes(currentRoutes);
  };
  return (
    <Content style={{ display: currentNode?.meta?.isFlex ? 'flex' : 'block' }}>
      <Suspense
        fallback={
          <div className={Style.loading}>
            <Loading />
          </div>
        }
      >
        <GetRoutes />
      </Suspense>
    </Content>
  );
};

export default memo(AppRouter);
