import React, { useState } from 'react';
import { isArray, get, find } from 'lodash';
import { baseInfoConfig, ICompanyDetailProps } from './config';
import { Card, Space, Tag, Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import ProductService from './ProductService';
import BasicInformation from './BasicInformation';
import DevelopmentManagement from './DevelopmentManagement';
import IntellectualProperty from './IntellectualProperty';
import EnterprisePersonnel from './EnterprisePersonnel';
import './style.css';

const tabItem = [
  {
    key: 'basicInformation',
    label: `基本信息`,
    children: BasicInformation,
  },
  {
    key: 'developmentManagement',
    label: `发展经营`,
    children: DevelopmentManagement,
  },
  {
    key: 'productService',
    label: `产品服务`,
    children: ProductService,
  },
  {
    key: 'intellectualProperty',
    label: `知识产权`,
    children: IntellectualProperty,
  },
  {
    key: 'enterprisePersonnel',
    label: `企业人员`,
    children: EnterprisePersonnel,
  },
];

export function CompanyDetail({ name, show, entInfo, desensitize }: ICompanyDetailProps) {
  const [selectTab, setTab] = useState('basicInformation');
  const [fold, setFold] = useState(true);
  // 不使用antd Tab组件的原因是，之后Tab和企业按钮会做吸顶样式，保证永远在顶部，方便操作
  return (
    <div id='new_company_detail'>
      <div
        onClick={() => {
          setFold(!fold);
        }}
        style={{
          marginLeft: '20px',
          cursor: 'pointer',
          color: '#3da8f5',
          width: '100px',
        }}
      >
        {fold ? (
          <>
            <VerticalAlignTopOutlined />
            折起详情
          </>
        ) : (
          <>
            <VerticalAlignBottomOutlined />
            展开详情
          </>
        )}
      </div>
      {fold ? (
        <Card bordered={false} id='CompanyBaseDetailTabCard'>
          <div id='CompanyBaseDetailTab'>
            <Row gutter={24} style={{ background: '#f5fbff' }}>
              {baseInfoConfig.map((item, index) => {
                let label = '';
                if (isArray(item.value)) {
                  for (let i = 0; i < item.value.length; i++) {
                    const labelItem = get(entInfo, `${item.value[i]}`);
                    // eslint-disable-next-line no-continue
                    if (!labelItem) continue;
                    if (i === 0) {
                      label += labelItem;
                    } else {
                      label = `${label}/${labelItem}`;
                    }
                  }
                } else {
                  label = get(entInfo, `${item.value}`);
                }
                return (
                  <Col
                    key={isArray(item.value) ? item.value[0] : item.value}
                    style={{
                      marginTop: '10px',
                      marginBottom: index === baseInfoConfig.length - 1 ? '10px' : '0',
                    }}
                    span={get(item, 'span', 1) * 6}
                  >
                    <>
                      <span
                        style={{
                          color: '#666',
                          float: 'left',
                          marginRight: '10px',
                        }}
                      >
                        {item.label}
                        {get(item, 'descrition') ? (
                          <Tooltip title={get(item, 'descrition')}>
                            <InfoCircleOutlined style={{ marginRight: '5px' }} />
                          </Tooltip>
                        ) : null}
                        <span>:</span>
                      </span>
                      <span style={{ color: '#333', float: 'left' }}>{label}</span>
                    </>
                  </Col>
                );
              })}
            </Row>
            <Row>
              <Col key={'reg_no'} style={{ marginTop: '10px' }} span={24}>
                <>
                  <span>{'画像标签:  '}</span>
                  <Space size={[0, 8]} wrap>
                    {get(entInfo, 'ent_tag', '')
                      .split(';')
                      .map((item) => (
                        <Tag
                          key={item}
                          style={{
                            color: '#0084FF',
                            backgroundColor: '#EBF5FF',
                            border: 'none',
                          }}
                        >
                          {item}
                        </Tag>
                      ))}
                  </Space>
                </>
              </Col>
            </Row>
          </div>
        </Card>
      ) : null}
      <Card bordered={false} id='CompanyDetailTab'>
        <div
          onClick={(e) => {
            const { target } = e;
            const selectKey = get(find(tabItem, { label: (target as any).innerText }), 'key');
            if (!selectKey) return;
            if (get(find(tabItem, { label: (target as any).innerText }), 'disabled') || selectKey === selectTab) {
              return;
            }
            (document as any).querySelector('.activety_tab').classList.remove('activety_tab');
            (target as any).classList.add('activety_tab');
            setTab(selectKey);
          }}
          style={{
            marginBottom: '10px',
            display: 'flex',
            position: 'unset',
            borderBottom: '2px solid rgb(212 199 199)',
          }}
        >
          {tabItem.map((item, index) => {
            let classname = 'tab_item';
            if (index === 0) {
              classname = 'tab_item_first';
            }
            if (selectTab === item.key) {
              classname += ' activety_tab';
            }
            return (
              <div style={{ fontSize: '15px' }} key={item.key} className={classname}>
                {item.label}
              </div>
            );
          })}
        </div>
        {tabItem.map((item) => {
          const ItemComponent = item.children;
          const isShow = item.key === selectTab;
          return (
            <ItemComponent
              isShow={isShow}
              name={name}
              show={show}
              key={item.key}
              fold={fold}
              desensitize={desensitize}
            ></ItemComponent>
          );
        })}
      </Card>
    </div>
  );
}
CompanyDetail.displayName = 'CompanyDetail';
