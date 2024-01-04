import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreation } from 'ahooks';
import { Table, Typography } from 'antd';
import { getLabelFromOptionList } from '../../Common/util';
import { statusOptions, boolTypeFieldOptions, sourceTypeOptions } from '../config';
import { get } from 'lodash';

export function ListTable({ dataSource, isEventEditable, onBtnOnlineClick, onBtnOfflineClick }: any) {
  /* 整理表格列的定义 */
  const columns = useCreation(
    () =>
      // eslint-disable-next-line no-use-before-define
      buildColumns({
        isEventEditable,
        onBtnOnlineClick,
        onBtnOfflineClick,
      }),
    [],
  );
  const [pageSize, setPageSize] = useState(20);

  /* 注意使用DsTable而不是原生的Table组件 */
  return (
    <Table
      dataSource={dataSource}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columns={columns}
      rowKey='event_id'
      pagination={{
        pageSize,
        pageSizeOptions: [20, 50, 100],
      }}
      onChange={(pageInfo) => {
        setPageSize(get(pageInfo, 'pageSize', 20));
      }}
      scroll={{ x: '100%' }}
    />
  );
}
ListTable.displayName = 'ListTable';

function buildColumns({ isEventEditable, onBtnOnlineClick, onBtnOfflineClick }: any) {
  const columns = [
    {
      title: '表ID',
      dataIndex: 'event_id',
      width: 80, // width务必按实际所需长度传入
      fixed: 'left',
      align: 'center',
    },
    {
      title: '数据源中文名',
      dataIndex: 'event_name',
      width: 200,
      fixed: 'left',
      render(val: string, row: any) {
        const { event_id: eventId } = row;
        return (
          <Link key='detail' to={`/enterprise/portrait_meta/event_manage/detail/${eventId}`}>
            {val}
          </Link>
        );
      },
    },
    {
      title: '数据源表名',
      dataIndex: 'field_source',
      width: 200,
    },
    {
      title: '数据源类型',
      dataIndex: 'source_type',
      width: 120,
      render(val: string) {
        return getLabelFromOptionList(sourceTypeOptions, val);
      },
    },
    {
      title: '数据源来源中心',
      dataIndex: 'ft',
      width: 200,
    },
    {
      title: '数据更新时间',
      dataIndex: 'updated_at',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render(val: string) {
        return getLabelFromOptionList(statusOptions, val);
      },
    },
    {
      title: '是否用于筛选',
      dataIndex: 'is_show',
      width: 135,
      render(val: string) {
        return getLabelFromOptionList(boolTypeFieldOptions, val);
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 135,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'control',
      width: 180,
      render(val: string, record: any) {
        const { event_id: eventId, status } = record;

        /* 请返回ReactNode数组 */
        return [
          isEventEditable ? (
            <Link className='mr10' key='edit' to={`/enterprise/portrait_meta/event_manage/edit/${eventId}`}>
              编辑
            </Link>
          ) : null,
          isEventEditable && status === 'OFFLINE' ? (
            <Typography.Link
              className='mr10'
              key='online'
              onClick={() => {
                onBtnOnlineClick(eventId);
              }}
            >
              上线
            </Typography.Link>
          ) : null,
          isEventEditable && status === 'ONLINE' ? (
            <Typography.Link
              className='mr10'
              key='online'
              onClick={() => {
                onBtnOfflineClick(eventId);
              }}
            >
              下线
            </Typography.Link>
          ) : null,
        ];
      },
    },
  ];

  return columns;
}
