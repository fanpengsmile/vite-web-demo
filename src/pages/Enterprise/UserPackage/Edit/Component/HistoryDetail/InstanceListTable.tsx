/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Table, message } from 'antd';
import { instanceStatusOptions } from '../../../config';
import { getLabelFromOptionList } from '../../../../Common/util';
import {
  useRequestGetUserPackageInstanceDetailDataExcelDownloadUrl,
  useRequestGetUserPackageInstanceDetailDataExcelAsyncDownloadUrl,
} from '../../../../base/cgi';
import { useSafeState, useMount } from 'ahooks';
import { isNil } from 'lodash';

function buildColumns({
  taskId,
  availableForDownloadPackageInstanceDetailExtendField,
  // availableForDownloadPackageInstanceDetail,
  availableForCheckPackageInstanceDetail,
  // requestGetDownloadUrlLoading,
  // currentDonwloadInstanceId,
  // onBtnDownloadClick,
  fromSystem,
  runRequestGetAsyncDownloadUrl,
  requestGetAsyncDownloadUrlLoading,
  isSqlType,
  dataType,
}: any) {
  const columns = [
    {
      title: '序列ID',
      dataIndex: 'inst_id',
      width: 100,
    },
    {
      title: dataType === 'phone' ? '号码包数量' : '分群数量UIN',
      dataIndex: 'match_uin_cnt',
      width: 120,
      render: (value: string) => {
        if (isNil(value)) return '-';
        return value.toLocaleString();
      },
    },
    // {
    //   title: 'CID',
    //   dataIndex: 'match_uin_cnt',
    //   width: 120,
    //   render: (value) => {
    //     if (isNil(value)) return '-'
    //     return value.toLocaleString()
    //   },
    // },
    {
      title: '分群数量CID',
      dataIndex: 'cid_count',
      width: 120,
      render: (value: string) => {
        if (isNil(value)) return '-';
        return value.toLocaleString();
      },
    },
    {
      title: '提取时间',
      dataIndex: 'start_time',
      width: 180,
    },
    {
      title: '提取状态',
      dataIndex: 'status',
      width: 120,
      render: (value: string) => {
        return getLabelFromOptionList(instanceStatusOptions, value);
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render(value: string, row: any) {
        const { inst_id: instanceId, download_status: downloadStatus, download_progress: downloadProgress } = row;
        // const isDownloading =
        //   requestGetDownloadUrlLoading &&
        //   currentDonwloadInstanceId === instanceId
        if (dataType === 'phone') {
          return [
            <span
              style={{
                marginRight: '10px',
                color: '#bfbfbf',
                cursor: 'not-allowed',
              }}
              key='detail'
            >
              查看
            </span>,
            <span style={{ color: '#bfbfbf', cursor: 'not-allowed' }} key='download'>
              下载
            </span>,
          ];
        }
        return [
          availableForCheckPackageInstanceDetail && (
            <Link
              key='detail'
              className='mr10'
              to={`/enterprise/user_package/detail/${taskId}/customer_list/${instanceId}/${dataType}${
                isSqlType ? '?sql_type=1' : ''
              }`}
            >
              查看
            </Link>
          ),
          // availableForDownloadPackageInstanceDetail && (
          //   <Typography.Link
          //     key="download"
          //     className="mr10"
          //     disabled={requestGetDownloadUrlLoading}
          //     onClick={() => onBtnDownloadClick(instanceId)}
          //   >
          //     下载
          //     <Spin spinning={isDownloading} size="small" />
          //   </Typography.Link>
          // ),
          availableForDownloadPackageInstanceDetailExtendField &&
            // eslint-disable-next-line no-use-before-define
            buildBtnDownloadDetail({
              downloadStatus,
              downloadProgress,
              onBtnDownloadDetailClick: () => runRequestGetAsyncDownloadUrl(instanceId),
              requestGetAsyncDownloadUrlLoading,
            }),
        ];
      },
    },
  ];

  return columns;

  function buildBtnDownloadDetail({
    downloadStatus,
    downloadProgress,
    requestGetAsyncDownloadUrlLoading,
    onBtnDownloadDetailClick,
  }: any) {
    switch (downloadStatus) {
      case 'no_load':
        return null;
      case 'loading':
        return <span style={{ color: 'rgba(0,0,0,.15)' }}>详情拉取中({downloadProgress})</span>;
      case 'done':
        return (
          <Typography.Link
            key='downloadDetail'
            disabled={requestGetAsyncDownloadUrlLoading}
            onClick={onBtnDownloadDetailClick}
          >
            下载详情
          </Typography.Link>
        );
      case 'error':
        return <Typography.Text type='danger'>下载详情失败</Typography.Text>;
      default:
        return null;
    }
  }
}

export function InnerInstanceListTable({
  common: { panshiAuthMap },
  taskId,
  dataSource,
  fromSystem,
  isSqlType,
  dataType,
}: any) {
  const availableForDownloadPackageInstanceDetail =
    panshiAuthMap?.enterprisePackageManage?.availableForDownloadPackageInstanceDetail;
  const availableForDownloadPackageInstanceDetailExtendField =
    panshiAuthMap?.enterprisePackageManage?.availableForDownloadPackageInstanceDetailExtendField;
  const availableForCheckPackageInstanceDetail =
    panshiAuthMap?.enterprisePackageManage?.availableForCheckPackageInstanceDetail;
  const [currentDonwloadInstanceId, setCurrentDonwloadInstanceId] = useSafeState();
  const { runRequestGetDownloadUrl, requestGetDownloadUrlLoading } =
    useRequestGetUserPackageInstanceDetailDataExcelDownloadUrl((downloadUrl: string) => {
      // @ts-ignore
      setCurrentDonwloadInstanceId();
      message.success('已发起下载');
      window.location.href = downloadUrl;
    });
  const { runRequestGetAsyncDownloadUrl, requestGetAsyncDownloadUrlLoading } =
    useRequestGetUserPackageInstanceDetailDataExcelAsyncDownloadUrl((downloadUrl: string) => {
      message.success('已发起下载');
      window.location.href = downloadUrl;
    });
  const onBtnDownloadClick = (instanceId: number) => {
    // @ts-ignore
    setCurrentDonwloadInstanceId(instanceId);
    runRequestGetDownloadUrl(instanceId);
  };

  useMount(() => {
    if (window.location.hash === '#user_package_instance_list_table') {
      // @ts-ignore
      document.getElementById('user_package_instance_list_table').scrollIntoView(true);
    }
  });

  return (
    <div id='user_package_instance_list_table'>
      <Table
        columns={buildColumns({
          taskId,
          availableForDownloadPackageInstanceDetailExtendField,
          availableForDownloadPackageInstanceDetail,
          availableForCheckPackageInstanceDetail,
          requestGetDownloadUrlLoading,
          currentDonwloadInstanceId,
          onBtnDownloadClick,
          fromSystem,
          runRequestGetAsyncDownloadUrl,
          requestGetAsyncDownloadUrlLoading,
          isSqlType,
          dataType,
        })}
        dataSource={dataSource}
        scroll={{ x: 'max-content', y: 400 }}
        rowKey='inst_id'
        pagination={false}
      />
    </div>
  );
}
export const InstanceListTable = InnerInstanceListTable;
