import React, { useState, useEffect } from 'react';
import { Card, Form, Spin, Select, message } from 'antd';
import { map, get } from 'lodash';
import { getUserPackageTaskList, getUserPackageTaskInstanceList } from 'services/enterprise';
import { ExclamationCircleTwoTone } from '@ant-design/icons';

function GroupSelect({ detailData, form, isDetail, setAimPkgInstId, setPkgInstId, dataType = 'uin' }: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    const [res, err] = await getUserPackageTaskList({
      page_index: 1,
      page_size: 2000,
      data_type: dataType,
    });
    if (err) {
      message.error(err.message);
      return;
    }
    setData(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map(get(res, 'pkg_task_list', []), (task) => {
        const { task_id: taskId, task_name: taskName, period_type: periodType } = task;
        return {
          value: `task-${taskId}:${taskName}`,
          label: `${taskName}(${taskId})`,
          isLeaf: periodType === 'once',
          _taskId: taskId,
        };
      }),
    );
    setLoading(false);
  };
  useEffect(() => {
    if (detailData) {
      let layout = {};
      try {
        layout = JSON.parse(get(detailData, 'layout'));
      } catch (error) {
        message.error('保存报告数据有误');
      }
      form.setFieldsValue({
        aimCluster: get(layout, 'aimCluster'),
        contrastCluster: get(layout, 'contrastCluster'),
      });
    }
  }, [detailData]);
  useEffect(() => {
    fetchData();
  }, [dataType]);

  return (
    <Card
      title={
        <>
          选择分群
          <ExclamationCircleTwoTone style={{ marginRight: 5, marginLeft: 10, fontSize: 14 }} />
          <span style={{ fontSize: '12px' }}>请导入分群管理中已创建的分群，进行画像洞察</span>
        </>
      }
      style={{ marginTop: '20px' }}
    >
      <Spin spinning={loading}>
        <span style={{ color: '#ff4d4f' }}>*</span>
        目标分群（请导入分群管理中已创建的分群用户包）
        <Form.Item
          name='aimCluster'
          style={{ marginTop: '15px' }}
          rules={[
            {
              required: true,
              message: '目标分群不能为空',
            },
          ]}
        >
          <Select
            notFoundContent='没有可用的分群用户包'
            placeholder='请选择分群用户包'
            options={data}
            disabled={isDetail}
            onChange={async (v) => {
              if (!v) {
                setAimPkgInstId(0);
                return;
              }
              setLoading(true);
              const aimContrastClusterId = parseInt(v.split(':')[0].replace('task-', ''), 10);
              const [aimres, err] = await getUserPackageTaskInstanceList({
                task_id_list: [aimContrastClusterId],
                page_index: 1,
                page_size: 2,
              });
              let aimContrastClusterTaskId = 0;
              if (aimres) {
                aimContrastClusterTaskId = get(aimres, 'pkg_task_inst_list.0.inst_id');
                setAimPkgInstId(aimContrastClusterTaskId);
              } else {
                message.error('查询接口出错');
                return;
              }
              setLoading(false);
            }}
          ></Select>
        </Form.Item>
        对照分群（请导入分群管理中已创建的分群用户包）
        <Form.Item style={{ marginTop: '15px' }} name='contrastCluster'>
          <Select
            notFoundContent='没有可用的分群用户包'
            placeholder='请选择分群用户包'
            options={data}
            allowClear
            onChange={async (v) => {
              setLoading(true);
              const aimContrastClusterId = parseInt(v.split(':')[0].replace('task-', ''), 10);
              const [aimres, err] = await getUserPackageTaskInstanceList({
                task_id_list: [aimContrastClusterId],
                page_index: 1,
                page_size: 2,
              });
              let aimContrastClusterTaskId = 0;
              if (aimres) {
                aimContrastClusterTaskId = get(aimres, 'pkg_task_inst_list.0.inst_id');
                setPkgInstId(aimContrastClusterTaskId);
              } else {
                message.error('查询接口出错');
                return;
              }
              setLoading(false);
            }}
          ></Select>
        </Form.Item>
      </Spin>
    </Card>
  );
}

export default GroupSelect;

GroupSelect.displayName = 'GroupSelect';
