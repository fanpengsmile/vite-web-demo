/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Popconfirm, Tooltip, Table, Input, message } from 'antd';
import { QuestionCircleTwoTone, EditOutlined } from '@ant-design/icons';
import { editUserPackageTask } from 'services/enterprise';
import { getLabelFromOptionList, usePvReport } from '../../../Common/util';
import {
  taskTypeOptions,
  userPackageTaskStatusOptions,
  periodTypeOptions,
  taskTypeRouteMap,
  userIdTypeOptions,
} from '../../config';
import { includes, get, find, isEmpty } from 'lodash';

export const ListTable = ({
  common: { env },
  route,
  match,
  tableProps,
  loading = false, // 注意loading参数不在tableProps中
  handleDelete,
  isFromCemSystem = false,
  fromSystem,
  refreshUserPackageTaskList,
  packageListIssue,
}: any) => {
  const isDev = includes(['local', 'development'], env);
  function reportBtnClickEvent(btnLabel: string) {
    usePvReport(route, match, {
      event_type: 'button',
      event_detail: btnLabel,
    });
  }
  const columns = [
    {
      title: '分群名称和ID',
      dataIndex: 'task_name',
      width: 150,
      fixed: 'left',
      render: (v: string, record: any) => {
        const { task_id: taskId, task_type: type } = record;
        return (
          <>
            <Link
              className='mr10 link-btn'
              key='detail'
              to={`/enterprise/user_package/${type === 'sql' ? 'sql_import/' : ''}detail/${taskId}`}
              onClick={() => {
                reportBtnClickEvent('查看');
              }}
            >
              {v}
            </Link>
            <p>{taskId}</p>
          </>
        );
      },
    },
    {
      title: '分群数量',
      dataIndex: 'match_uin_cnt',
      width: 100,
    },
    {
      title: '最新拉取时间',
      dataIndex: 'current_extract_time',
      width: 120,
    },
    {
      title: '创建方式',
      dataIndex: 'task_type',
      width: 100,
      render(value: string) {
        return getLabelFromOptionList(taskTypeOptions, value);
      },
    },
    {
      title: 'ID类型',
      dataIndex: 'data_type',
      width: 100,
      render(value: string) {
        return get(find(userIdTypeOptions, { value }), 'label');
      },
    },
    {
      title: '更新周期',
      dataIndex: 'period_type',
      width: 100,
      render(value: string) {
        return getLabelFromOptionList(periodTypeOptions, value);
      },
    },
    {
      title: '有效期',
      dataIndex: 'expired',
      width: 140,
      render(value: string, row: any) {
        return `${row?.task_start_time} ~ ${row?.task_end_time}`;
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      width: 100,
      render: (value: string) => {
        const option = find(userPackageTaskStatusOptions, { value });
        if (isEmpty(option)) {
          return '未知状态';
        }
        if (option.tipsForListTable) {
          return (
            <span>
              {option.label}{' '}
              <Tooltip title={option.tipsForListTable}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </span>
          );
        }
        return option.label;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: (value: string, record: any) => (
        <Fragment>
          {(editItem as any).id === record.task_id ? (
            <Input
              value={(editItem as any).desc}
              style={{ width: '200px' }}
              min={0}
              onChange={(e) => {
                setEditItem({ id: (editItem as any).id, desc: e.target.value });
              }}
              onBlur={async () => {
                try {
                  const [res, err] = await editUserPackageTask({
                    task_id: (editItem as any).id,
                    remark: (editItem as any).desc,
                  });
                  if (res) {
                    message.success('添加备注成功');
                    refreshUserPackageTaskList();
                  }
                  if (err) {
                    message.error(err.message);
                    return;
                  }
                  setEditItem({});
                } catch (error) {
                  message.error(get(error, 'returnMessage', '添加备注失败'));
                  setEditItem({});
                }
              }}
            />
          ) : (
            <Fragment>
              <span>{value}</span>
              <EditOutlined
                onClick={() => {
                  setEditItem({
                    id: record.task_id,
                    desc: value,
                  });
                }}
              />
            </Fragment>
          )}
        </Fragment>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render(val: string, record: any) {
        const { task_id: taskId, task_type: taskType, data_type: datatype } = record;
        const cemUrl = isDev
          ? `https://busniess-oppty.testsite.woa.com/clue-task/my-task/create?packetid=${taskId}`
          : `https://forcem.woa.com/clue-task/my-task/create?packetid=${taskId}`;
        return [
          // eslint-disable-next-line no-nested-ternary
          isFromCemSystem ? (
            !packageListIssue && taskType === 'extract' && datatype === 'company' ? (
              <span className='mr10' style={{ color: 'gray', cursor: 'no-drop' }}>
                下发
              </span>
            ) : (
              <Typography.Link className='mr10 link-btn' key='toCem' href={cemUrl}>
                下发
              </Typography.Link>
            )
          ) : null,
          <Link
            className='mr10 link-btn'
            key='edit'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            to={`/enterprise/user_package/${taskTypeRouteMap[taskType]}/${taskId}`}
            onClick={() => {
              reportBtnClickEvent('编辑');
            }}
          >
            编辑
          </Link>,
          <Link
            className='mr10 link-btn'
            key='copy'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            to={`/enterprise/user_package/${taskTypeRouteMap[taskType]}/${taskId}?isCopy=1'`}
            onClick={() => {
              reportBtnClickEvent('复制');
            }}
          >
            复制
          </Link>,
          /* 删除操作需要使用Popconfirm做二次确认 */
          <Popconfirm key='delete' title='确定要删除吗？' onConfirm={() => handleDelete(taskId)}>
            <Typography.Link
              onClick={() => {
                reportBtnClickEvent('删除');
              }}
            >
              删除
            </Typography.Link>
          </Popconfirm>,
        ];
      },
    },
  ];
  const [editItem, setEditItem] = useState({});
  return (
    <Table
      {...tableProps}
      loading={loading}
      columns={columns}
      scroll={{
        x: '1600px',
      }}
      rowKey='task_id'
    />
  );
};
