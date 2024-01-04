import React, { Fragment, ReactElement } from 'react';
import { Typography, Button, Alert, Space } from 'antd';
import { eventTrackingReport as report } from 'services/enterprise';
import { isString, isObject, get, includes, isEmpty, some } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './adminContentLayout.css';

// const { AdminContentLayout: CommonAdminContentLayout } = components;

export interface AdminContentLayoutHeaderProps {
  /**
   * @description 页面标题
   */
  title?: string;
  /**
   * @description 可传跳转的url字符串，或是配合isUseBackUrl传true来显示一个“后退”按钮
   */
  backUrl?: string | boolean;
  /**
   * @description 是渲染跳转按钮还是后退按钮；一共分2种情况：当backUrl为真值且isUseBackUrl为假值时显示浏览器后退按钮；当backUrl为非空字符串且isUseBackUrl为真值时显示跳转按钮；
   */
  isUseBackUrl?: boolean;
  /**
   * 需要渲染在AdminContentLayoutHeader右侧的内容
   */
  headerRightExtra?: ReactElement;
  /**
   * @description 需要渲染的页面内容
   */
  children?: ReactElement;
  /**
   * 从npm包react-router-dom中拿到的Link，一般不需要关心
   */
  Link?: ReactElement; // 改为由父组件传入，否则有可能引起react-router版本冲突
}

const AdminContentLayoutHeader = ({
  title,
  backUrl,
  isUseBackUrl,
  headerRightExtra,
  children,
  Link,
}: AdminContentLayoutHeaderProps) => (
  // 临时方案：这里先增加isUseBackUrl字段，目的是解决用户直接通过复制粘贴链接进来，点击页面的返回按钮时跳出点石的bug
  /**
   * 关于“返回”按钮逻辑优化的调研(20211025)：
   * 目前调研得到两个相关浏览器api，window.performance.navigation.type和window.history.length，两者均无法区分开用户是否为点石内部跳转
   * 因为若从点石外部点击链接跳转至当前页面，有可能会因为没有登录oa导致先跳转到智能网关的登录页面，登录后再跳转到点石页面
   * 此时window.performance.navigation.type为TYPE_NAVIGATE（跟内部跳转一样），window.history.length为3(若为1才能和内部跳转区分开来)
   * 因此尚无优化方案
   */
  <div className={styles.adminContentHeader}>
    <div className={styles.adminContentHeaderContent}>
      <div className={styles.adminContentHeaderTitle}>
        <Space>
          {!!backUrl && !isUseBackUrl && (
            // eslint-disable-next-line no-restricted-globals
            <Button type='link' style={{ padding: 0 }} onClick={() => history.go(-1)}>
              <ArrowLeftOutlined />
            </Button>
          )}
          {!!backUrl && isString(backUrl) && !!isUseBackUrl && !!Link && (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Link to={backUrl as string}>
              <ArrowLeftOutlined />
            </Link>
          )}
          <span className='adminContentHeaderTitle' style={{ verticalAlign: 'middle' }}>
            {title}
          </span>
        </Space>
        {!!headerRightExtra && (
          <div style={{ display: 'inline-block', position: 'absolute', right: 10 }}>{headerRightExtra}</div>
        )}
      </div>
      <div>{children}</div>
    </div>
  </div>
);

export function AuthAlert() {
  return (
    <Alert
      message={
        <span>
          <Typography.Link href='https://panshi.woa.com/authority/permission/apply' target='_blank'>
            点击此处
          </Typography.Link>
          进行申请权限，如有疑问，请咨询
          <Typography.Text strong>ericpqzhu(朱普庆)</Typography.Text>
        </span>
      }
      type='error'
    />
  );
}

export interface AdminContentLayoutProps {
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 可传跳转的url字符串，或是配合isUseBackUrl传true来显示一个“后退”按钮
   */
  backUrl?: string | boolean;
  /**
   * 是渲染跳转按钮还是后退按钮；一共分2种情况：当backUrl为真值且isUseBackUrl为假值时显示浏览器后退按钮；当backUrl为非空字符串且isUseBackUrl为真值时显示跳转按钮；
   */
  isUseBackUrl?: boolean;
  /**
   * 需要渲染在AdminContentLayoutHeader右侧的内容
   */
  headerRightExtra?: ReactElement;
  /**
   * 需要渲染的页面内容
   */
  children?: ReactElement;
  /**
   * 鉴权失败时显示的提示内容
   */
  authCheckFailedDisplay?: ReactElement | string;
  /**
   * 当前页面要求的点石白名单权限点code
   */
  whiteListAuthPointCodeRequired?: string;
  /**
   * 当前页面要求的点石白名单权限点code列表，拥有其中之一即可；与whiteListAuthPointCodeRequired参数互斥
   */
  whiteListAuthPointCodeListRequired?: Array<string>;
  /**
   * 当前用户拥有的点石白名单权限code列表
   */
  wholeAuthPointCodeArr?: Array<string>;
  /**
   * 当前所属环境：production / development / local
   */
  env?: string;
  /**
   * 当前页面要求的磐石权限，形如groupPortrait.pageAuth，与panshiAuthMap参数的数据结构对应
   */
  panshiAuthRequired?: string;
  /**
   * 当前用户拥有的磐石权限列表
   */
  panshiAuthMap?: object;
  /**
   * 从npm包react-router-dom中拿到的Link，一般不需要关心
   */
  Link?: ReactElement; // 改为由父组件传入，否则有可能引起react-router版本冲突
}

export interface AdminContentLayoutBodyProps {
  /**
   * @description 需要渲染的页面内容
   */
  children?: ReactElement;
  /**
   * @description 鉴权失败时显示的提示内容
   */
  authCheckFailedDisplay?: ReactElement | string;
  /**
   * 当前页面要求的点石白名单权限点code
   */
  whiteListAuthPointCodeRequired?: string;
  /**
   * 当前页面要求的点石白名单权限点code列表，拥有其中之一即可；与whiteListAuthPointCodeRequired参数互斥
   */
  whiteListAuthPointCodeListRequired?: Array<string>;
  /**
   * 当前用户拥有的点石白名单权限code列表
   */
  wholeAuthPointCodeArr?: Array<string>;
  /**
   * 当前所属环境：production / development / local
   */
  env?: string;
  /**
   * 当前页面要求的磐石权限，形如groupPortrait.pageAuth，与panshiAuthMap参数的数据结构对应
   */
  panshiAuthRequired?: string;
  /**
   * 当前用户拥有的磐石权限列表
   */
  panshiAuthMap?: object;
}

export function AdminContentLayoutBody(props: AdminContentLayoutBodyProps) {
  return (
    <div className={styles.adminContent}>
      {
        // eslint-disable-next-line no-use-before-define
        <MainContent {...props} />
      }
    </div>
  );
}

function checkAuth({
  whiteListAuthPointCodeRequired,
  whiteListAuthPointCodeListRequired,
  wholeAuthPointCodeArr,
  // env,
  panshiAuthRequired,
  panshiAuthMap,
}: {
  whiteListAuthPointCodeRequired?: string;
  whiteListAuthPointCodeListRequired?: Array<string>;
  wholeAuthPointCodeArr?: Array<string>;
  env?: string;
  panshiAuthRequired?: string;
  panshiAuthMap?: object;
}) {
  if (panshiAuthRequired) {
    return isObject(panshiAuthMap) && get(panshiAuthMap, panshiAuthRequired);
  }
  if (whiteListAuthPointCodeRequired) {
    return includes(wholeAuthPointCodeArr, whiteListAuthPointCodeRequired);
  }
  if (!isEmpty(whiteListAuthPointCodeListRequired)) {
    return some(whiteListAuthPointCodeListRequired, (authPointCodeRequired) =>
      includes(wholeAuthPointCodeArr, authPointCodeRequired),
    );
  }

  return true;
}

function MainContent(props: AdminContentLayoutBodyProps): React.ReactElement {
  const {
    children,
    authCheckFailedDisplay,
    whiteListAuthPointCodeRequired,
    whiteListAuthPointCodeListRequired,
    wholeAuthPointCodeArr,
    env,
    panshiAuthRequired,
    panshiAuthMap,
  } = props;

  const isPassAuthCheck = checkAuth({
    whiteListAuthPointCodeRequired,
    whiteListAuthPointCodeListRequired,
    wholeAuthPointCodeArr,
    env,
    panshiAuthRequired,
    panshiAuthMap,
  });

  if (isPassAuthCheck) {
    return children ? (children as ReactElement) : <div>当前页面为空</div>;
  }

  if (isString(authCheckFailedDisplay)) return <Alert message={authCheckFailedDisplay} type='error' />;
  return authCheckFailedDisplay || <Alert message='您未被授权访问此页，请联系管理员' type='error' />;
}

export function InnerAdminContentLayout(props: AdminContentLayoutProps) {
  const { title, backUrl, isUseBackUrl, headerRightExtra, Link } = props;

  return (
    <Fragment>
      {/* 兼容老的写法 */}
      {title && (
        <>
          <AdminContentLayoutHeader
            title={title}
            backUrl={backUrl}
            isUseBackUrl={isUseBackUrl}
            headerRightExtra={headerRightExtra}
            Link={Link}
          />
          <AdminContentLayoutBody {...props} />
        </>
      )}
      {!title && <MainContent {...props} />}
    </Fragment>
  );
}

function EnterpriseHelpTips() {
  return (
    <Typography.Link
      href='https://iwiki.woa.com/pages/viewpage.action?pageId=4007763058'
      target='_blank'
      style={{ fontSize: 14, fontWeight: 'normal', paddingRight: 7 }}
      onClick={() => {
        report({
          event_type: 'button',
          event_detail: '帮助文档',
          from_system: window.top === window.self ? '商机' : '其他',
        });
      }}
    >
      帮助文档
    </Typography.Link>
  );
}

export const CommonAdminContentLayout = InnerAdminContentLayout;

export function AdminContentLayout(props: any) {
  return <CommonAdminContentLayout headerRightExtra={<EnterpriseHelpTips />} {...props} />;
}
