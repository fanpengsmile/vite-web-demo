import React from 'react';
import { Typography, Popover, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { isNil, isEmpty } from 'lodash';
import { eventTrackingReport } from 'services/enterprise';

// const { DsTable } = components

function buildColumns({ onClickCompanyName }: any) {
  return [
    {
      title: '企业名称',
      dataIndex: 'name',
      width: 300,
      fixed: 'left',
      render(value: string) {
        return (
          <Typography.Link
            onClick={() => {
              eventTrackingReport({
                event_type: 'request',
                level1_module: '找企业',
                level2_module: '全国企业圈选',
                level3_module: '企业详情',
                from_system: window.top === window.self ? '商机' : '其他',
                event_detail: '企业详情',
              });
              onClickCompanyName(value);
            }}
          >
            {value}
          </Typography.Link>
        );
      },
    },
    {
      title: '行业',
      dataIndex: 'second_industry',
      width: 180,
    },
    {
      title: '法人',
      dataIndex: 'oper_name',
      width: 100,
    },
    {
      title: '工商注册时间',
      dataIndex: 'start_date',
      width: 120,
    },
    {
      title: '注册资本',
      dataIndex: 'regist_capi',
      width: 150,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '通讯地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '备案域名',
      dataIndex: 'home_url',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: (
        <>
          <span>域名热度</span>
          <Popover content='企业备案域名昨天的域名解析量' trigger='click'>
            <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
          </Popover>
        </>
      ),
      dataIndex: 'domain_req_count',
      width: 120,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '已为腾讯云客户',
      dataIndex: 'is_tx_cloud_user',
      width: 140,
    },
    {
      title: '主销售',
      dataIndex: 'customer_business_manager',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '销售类型',
      dataIndex: 'manager_type',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: 'UIN行业',
      dataIndex: 'business_group_desc',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '收入级别',
      dataIndex: 'cid_avg_income_recnet3mon_level',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
    {
      title: '消耗级别',
      dataIndex: 'cid_avg_consume_recnet3mon_level',
      ellipsis: true,
      width: 200,
      // eslint-disable-next-line no-use-before-define
      render: defaultRenderFunc,
    },
  ];
}

function defaultRenderFunc(value: string) {
  if (isNil(value) || value === '') {
    return '-';
  }

  return value;
}

export function ListTable({
  tableProps,
  loading = false, // 注意loading参数不在tableProps中
  onClickCompanyName,
  fetchCompanyData,
}: any) {
  const columns = buildColumns({
    onClickCompanyName,
    fetchCompanyData,
  });

  /* 注意使用DsTable而不是原生的Table组件 */
  return (
    <Table
      {...tableProps}
      loading={loading}
      columns={columns}
      scroll={{ x: '100%' }}
      rowKey='name'
      pagination={{
        ...(isEmpty(tableProps?.pagination) ? {} : tableProps.pagination),
        pageSizeOptions: [10, 20, 50, 100, 200],
      }}
    />
  );
}
ListTable.displayName = 'ListTable';
