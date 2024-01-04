import React, { memo, useEffect } from 'react';
import { Layout } from 'tdesign-react';
import { throttle } from 'lodash';
import AppContainer from './components/AppLayout';
import Style from './index.module.less';
import { useStore } from 'store';
import WithErrorBoundary from './withErrorBoundary';
import { rumConfigAegis } from 'utils/enterpriseRum';
import { initEnterPrise } from 'utils/enterprise'

export default memo(() => {
  const setMenuCollapsed = useStore((state) => state.setMenuCollapsed);
  const curStaffName = useStore((state) => state.currentStaffName);
  // 配置rum性能监控信息, uin
  rumConfigAegis(curStaffName);
  // 初始化配置画像权限点
  initEnterPrise();

  useEffect(() => {
    const handleResize = throttle(() => {
      if (window.innerWidth < 900) {
        setMenuCollapsed(true);
      } else if (window.innerWidth > 1000) {
        setMenuCollapsed(false);
      }
    }, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout className={Style.panel}>
      <WithErrorBoundary>
        <AppContainer />
      </WithErrorBoundary>
    </Layout>
  );
});
