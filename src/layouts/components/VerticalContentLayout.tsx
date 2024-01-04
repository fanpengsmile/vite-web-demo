import React from 'react';
import classnames from 'classnames';
import Style from './VerticalContentLayout.module.less';

export default ({ children, style = {} }: React.PropsWithChildren<{ style?: React.CSSProperties }>) => (
  <div className={classnames(Style.verticalBlockSpace)} style={style}>
    {children}
  </div>
);
