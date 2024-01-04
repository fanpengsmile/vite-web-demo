import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreation } from 'ahooks';
import { getLabelFromOptionList } from '../../Common/util';
import { STATUS_OPTIONS, IS_EXTRACT_TYPE_OPTIONS, tagGroupOptions } from '../config';
import { get, find } from 'lodash';
import { Typography, Table, Drawer } from 'antd';
import { DetailForm } from '../TagDictEdit/DetailForm';

export function ListTable({
  dataSource,
  isDictEditable,
  rowSelection,
  fromSystem,
  onBtnOnlineClick,
  onBtnOfflineClick,
  tagDirList,
}: any) {
  const [detail, setDetail] = useState(false);
  /* 整理表格列的定义 */
  const columns = useCreation(
    () =>
      // eslint-disable-next-line no-use-before-define
      buildColumns({
        isDictEditable,
        fromSystem,
        onBtnOnlineClick,
        onBtnOfflineClick,
        setDetail,
      }),
    [],
  );
  const [pageSize, setPageSize] = useState(20);

  /* 注意使用DsTable而不是原生的Table组件 */
  return (
    <>
      <Drawer
        open={!!detail}
        width={1400}
        title='标签元信息'
        onClose={() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setDetail(undefined);
        }}
      >
        <DetailForm detail={detail} tagDirList={tagDirList}></DetailForm>
      </Drawer>
      <Table
        dataSource={dataSource}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columns={columns}
        rowKey='tag_id'
        scroll={{ x: 1500 }}
        rowSelection={rowSelection}
        pagination={{
          pageSize,
          pageSizeOptions: [20, 50, 100],
        }}
        onChange={(pageInfo) => {
          setPageSize(get(pageInfo, 'pageSize', 20));
        }}
      />
    </>
  );
}
ListTable.displayName = 'ListTable';

function brhtml(v = '') {
  const snArray = v.split('\n');
  let result = null;
  let str = null;
  if (snArray.length >= 2) {
    for (let i = 0; i < snArray.length; i++) {
      if (i === 0) {
        result = snArray[i];
      } else {
        result = (
          <span>
            {result}
            {<br></br>}
            {snArray[i]}
          </span>
        );
      }
    }
    str = <div>{result}</div>;
  } else {
    return v;
  }
  const html = <label title={v}>{str}</label>;
  return html;
}

function buildColumns({ isDictEditable, fromSystem, onBtnOnlineClick, onBtnOfflineClick, setDetail }: any) {
  const columns = [
    {
      title: '标签ID',
      dataIndex: 'tag_id',
      width: 80, // width务必按实际所需长度传入
      fixed: 'left',
      align: 'center',
    },
    {
      title: '标签名称',
      dataIndex: 'tag_name',
      width: 250,
      fixed: 'left',
      render: (v: string, record: any) => {
        // const { tag_id: tagId } = record
        return (
          <a
            className='mr10'
            key='detail'
            onClick={() => {
              setDetail(record);
            }}
          >
            {v}
          </a>
        );
      },
    },
    {
      title: '服务字段名',
      dataIndex: 'tag_en_name',
      width: 200,
      ellipsis: true,
    },
    // {
    //   title: '标签实体',
    //   dataIndex: 'tag_type',
    //   width: 200,
    // },
    {
      title: 'ID类型',
      dataIndex: 'tag_group',
      width: 200,
      render: (v: string) => {
        const tag = find(tagGroupOptions, { value: v });
        return get(tag, 'label');
      },
    },
    {
      title: '标签创建类型',
      dataIndex: 'create_type',
      width: 135,
      render: (v: string) => get(find(IS_EXTRACT_TYPE_OPTIONS, { value: v }), 'label', ''),
    },
    {
      title: '标签分类一级',
      dataIndex: 'firstLevelDirName',
      width: 130,
    },
    {
      title: '标签分类二级',
      dataIndex: 'secondLevelDirName',
      width: 180,
    },
    {
      title: '标签说明',
      dataIndex: 'tag_explain',
      width: 200,
      // ellipsis: true,
      render: (v: string) => {
        return brhtml(v);
      },
    },
    {
      title: '计算逻辑',
      dataIndex: 'calc_base_line',
      width: 200,
      render: (v: string) => {
        return brhtml(v);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 180,
      render: (v: string) => {
        const date = (v || '').split(' ');
        return (
          <>
            <span>{date[0]}</span>
            <br></br>
            <span>{date[1]}</span>
          </>
        );
      },
    },
    {
      title: '标签值刷新时间',
      dataIndex: 'updated_at',
      width: 180,
      render: (v: string) => {
        const date = (v || '').split(' ');
        return (
          <>
            <span>{date[0]}</span>
            <br></br>
            <span>{date[1]}</span>
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 135,
      render(val: string) {
        return getLabelFromOptionList(STATUS_OPTIONS, val);
      },
    },
    {
      title: '权限等级',
      dataIndex: 'security_level',
      width: 120,
    },

    {
      title: <span>操作</span>,
      dataIndex: 'control',
      width: 180,
      render(val: string, record: any) {
        // eslint-disable-next-line camelcase
        const { tag_id: tagId, status, tag_group } = record;

        /* 请返回ReactNode数组 */
        return [
          isDictEditable ? (
            // eslint-disable-next-line camelcase
            <Link className='mr10' key='edit' to={`/enterprise/portrait_meta/tag_dict/edit/${tagId}/${tag_group}`}>
              编辑
            </Link>
          ) : null,
          isDictEditable ? (
            <Typography.Link
              className='mr10'
              key='status'
              onClick={() => {
                if (status === 'ONLINE') {
                  onBtnOfflineClick(tagId);
                } else {
                  onBtnOnlineClick(tagId);
                }
              }}
            >
              {status === 'ONLINE' ? '下线' : '上线'}
            </Typography.Link>
          ) : null,
        ];
      },
    },
  ];

  return columns;
}
