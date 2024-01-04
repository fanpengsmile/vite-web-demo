import React, { memo } from 'react';
import Style from './Menu.module.less';
import MiniLogo from 'assets/svg/qiye.svg?component';
import { useNavigate } from 'react-router-dom';

interface IProps {
  collapsed?: boolean;
}

export default memo((props: IProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className={Style.menuLogo} onClick={handleClick}>
      {props.collapsed ? (
        <MiniLogo />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 8, marginLeft: -6, display: 'flex' }}>
            <MiniLogo />
          </div>
          <span style={{ fontSize: 17, fontWeight: 'bolder' }}>企业画像平台</span>
        </div>
      )}
    </div>
  );
});
