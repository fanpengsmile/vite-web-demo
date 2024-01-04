import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Popconfirm, message } from 'antd';
import { useCreation } from 'ahooks';
import { status } from '../../config';
import { deleteInsightTask } from 'services/enterprise';
import { get, find } from 'lodash';

function buildColumns(fetchData: any) {
  const columns = [
    {
      title: '分群画像名称',
      dataIndex: 'task_name',
      width: 100,
      fixed: 'left',
      render: (v: string, record: any) => {
        const { task_id: taskId } = record;
        return (
          <>
            <Link className='mr10 link-btn' to={`/enterprise/user_package/cluster_insight_detail/${taskId}`}>
              {v}
            </Link>
            <p style={{ color: '#999' }}>序号ID:{taskId}</p>
          </>
        );
      },
    },
    {
      title: '目标分群名称',
      dataIndex: 'layout',
      width: 120,
      render: (v: string) => {
        try {
          const { aimLabel } = JSON.parse(v);
          return aimLabel;
        } catch (error) {
          return '-';
        }
      },
    },
    {
      title: '群体规模',
      dataIndex: 'crowd_num',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 100,
    },
    // {
    //   title: '创建方式',
    //   dataIndex: 'task_type',
    //   width: 100,
    //   render: (v) => {
    //     return get(find(createType, { value: v }), 'label', '-')
    //   },
    // },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
      render: (v: string) => {
        return get(find(status, { value: v }), 'label', '-');
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render(val: string, record: any) {
        const { task_id: taskId } = record;
        return [
          <Link className='mr10 link-btn' key='edit' to={`/enterprise/user_package/cluster_insight_edit/${taskId}`}>
            编辑
          </Link>,
          <Link className='mr10 link-btn' key='copy' to={`/enterprise/user_package/cluster_insight_copy/${taskId}`}>
            复制
          </Link>,
          <Popconfirm
            key='delete'
            title='确认删除？'
            description='确认删除磁条数据?'
            onConfirm={() => {
              deleteInsightTask({
                task_id: taskId,
              })
                .then((res) => {
                  if (res[0]) {
                    message.success('删除成功');
                    fetchData();
                    return;
                  }
                  message.error(get(res, 'returnMessage', '删除失败'));
                })
                .catch((e) => {
                  message.error(get(e, 'returnMessage', '删除失败'));
                });
            }}
            okText='Yes'
            cancelText='No'
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  return columns;
}

export const ListTable = ({ dataSource, loading = false, pagination, onchange, fetchData }: any) => {
  /* 整理表格列的定义 */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns = useCreation(() => buildColumns(fetchData));
  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columns={columns}
      scroll={{
        x: '1400px',
      }}
      rowKey='task_id'
      onChange={(val) => {
        onchange(val);
      }}
    />
  );
};
ListTable.displayName = 'ListTable';
