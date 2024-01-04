import React, { useState } from 'react';
import { useBoolean, useSafeState, useMemoizedFn } from 'ahooks';
import { Drawer, Tabs, Tag, Space } from 'antd';
import { getCompanyEntInfo } from 'services/enterprise';
import { CompanyDetail } from '../Company/CompanyDetail';
import { get } from 'lodash';

export const PortraitDrawer = ({ triggerHideDrawer, drawerOpen, width, targetCompanyName: name, entInfo }: any) => {
  // const iframeStyle = useIframeStyle()
  const [tabValue, setTabValue] = useState('new');
  const afterDrawerClose = () => {
    triggerHideDrawer();
    setTabValue('new');
  };
  return drawerOpen ? (
    <Drawer
      title={
        <>
          <span style={{ marginRight: '10px' }}>{name}</span>
          <Space size={[0, 8]} wrap>
            <Tag
              style={{
                color: '#0084FF',
                backgroundColor: '#EBF5FF',
                border: 'none',
              }}
            >
              {get(entInfo, 'econ_kind', '')}
            </Tag>
            <Tag
              style={{
                color: '#119944',
                background: '#ECF7F0',
                border: 'none',
              }}
            >
              {get(entInfo, 'status', '')}
            </Tag>
          </Space>
        </>
      }
      placement='right'
      onClose={afterDrawerClose}
      open={drawerOpen}
      width={width}
      className='company_detail_drawer'
      styles={{ body: { padding: '0' } }}
    >
      <Tabs
        activeKey={tabValue}
        onChange={(v) => {
          setTabValue(v);
        }}
        style={{ marginLeft: '32px' }}
        items={[
          {
            key: 'new',
            label: (
              <>
                企业详情<span style={{ color: 'red' }}>New</span>
              </>
            ),
            children: <CompanyDetail entInfo={entInfo} show={drawerOpen} name={name}></CompanyDetail>,
          },
        ]}
      />
    </Drawer>
  ) : null;
};
PortraitDrawer.displayName = 'PortraitDrawer';

export function usePortraitDrawer() {
  const [targetCompanyName, setTargetCompanyName] = useSafeState('');
  const [drawerOpen, { setFalse: hideDrawer, setTrue: showDrawer }] = useBoolean(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [entInfo, setEntInfo] = useState({});

  // const { getDianshiPortraitUrlLoading } = useRequestGetDianshiPortraitUrl(
  //   targetCompanyName,
  //   (url) => {
  //     setIframeSrc(url)
  //   },
  // )

  const triggerShowPortraitDrawer = useMemoizedFn((targetCompanyName) => {
    setTargetCompanyName(targetCompanyName);
    showDrawer();
    getCompanyEntInfo({
      name: targetCompanyName,
    })
      .then((res) => {
        setEntInfo(get(res, '0.ent_info'));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const triggerHideDrawer = () => {
    setTargetCompanyName('');
    setIframeSrc('');
    hideDrawer();
  };

  return {
    triggerShowPortraitDrawer,
    triggerHideDrawer,
    iframeSrc,
    drawerOpen,
    // getDianshiPortraitUrlLoading,
    width: 'calc(100% - 200px)',
    targetCompanyName,
    entInfo,
  };
}
