import React from 'react';
import { Layout } from 'tdesign-react';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import Content from './AppRouter';
import Style from './AppLayout.module.less';

const SideLayout = React.memo(() => (
  <Layout className={Style.sidePanel}>
    <Menu showLogo showOperation />
    <Layout className={Style.sideContainer}>
      <Header />
      <Content />
      <Footer />
    </Layout>
  </Layout>
));
const FullPageLayout = React.memo(() => <Content />);

const resultElm = (() => {
  let result = FullPageLayout; // 默认是满页无侧边栏Layout
  if (window.top === window.self) {
    // 如果未被iframe嵌套则默认满页无侧边侧Layout
    result = SideLayout;
  }
  return result;
})();
export default resultElm;
