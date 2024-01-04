import React from 'react';
import { Layout, Row } from 'tdesign-react';

const { Footer: TFooter } = Layout;

const Footer = () => (
  <TFooter>
    <Row justify='center'>Copyright @ 2022-2024 Tencent. All Rights Reserved</Row>
  </TFooter>
);

export default React.memo(Footer);
