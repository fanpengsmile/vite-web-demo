import React from 'react';
import { Layout } from 'tdesign-react';
import Style from './Page.module.less';
import './default.less';

const { Content } = Layout;

const Page = ({
  children,
  isFlex,
  flexDirection,
}: React.PropsWithChildren<{ isFlex?: boolean; flexDirection?: 'column' | 'row' }>) => {
  return (
    <Content
      className={Style.panel}
      style={isFlex ? { flex: 1, display: 'flex', flexDirection: flexDirection ?? 'row', margin: 0 } : {}}
    >
      {children}
    </Content>
  );
};

export default React.memo(Page);
