/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import moment from 'moment';
import { Card, DatePicker, Spin, message } from 'antd';
import { useCreation, useSafeState, useMemoizedFn, useGetState } from 'ahooks';
import { VerticalBarChart } from './VerticalBarChart';
import { useRequestGetUserPackageTaskInstances } from '../../../../base/cgi';
import { InstanceListTable } from './InstanceListTable';
import { some, delay, map } from 'lodash';

function FilterForm({ onFilterDateRangeChange }: any) {
  return (
    <div style={{ textAlign: 'right', marginBottom: 10 }}>
      <span>选择日期：</span>
      <DatePicker.RangePicker format='YYYY-MM-DD' allowClear onChange={onFilterDateRangeChange} />
    </div>
  );
}

export const HistoryDetail = ({
  taskId,
  instanceList,
  requestInstancesLoading,
  chartData,
  onFilterDateRangeChange,
  isSqlType,
  dataType,
  common,
}: any) => {
  return (
    <Card title='分群提包统计' className='mb15'>
      <Spin spinning={!!requestInstancesLoading}>
        <FilterForm onFilterDateRangeChange={onFilterDateRangeChange} />
        <div className='mb15'>
          <VerticalBarChart primaryKey='package-history-detail-chart' displayResult={chartData} />
        </div>
        <InstanceListTable
          taskId={taskId}
          dataType={dataType}
          dataSource={instanceList}
          isSqlType={isSqlType}
          common={common}
        />
      </Spin>
    </Card>
  );
};
HistoryDetail.displayName = 'HistoryDetail';

export function useHistoryDetail({ taskId }: { taskId: number }) {
  const [filterDateRange, setFilterDateRange] = useSafeState([]);
  const [
    // eslint-disable-next-line no-unused-vars
    refreshInstanceListCount,
    setRefreshInstanceListCount,
    getRefreshInstanceListCount,
  ] = useGetState(0);
  const onFilterDateRangeChange = useMemoizedFn((newDateRangeValue) => {
    setFilterDateRange([
      // @ts-ignore
      newDateRangeValue?.[0]?.format('YYYY-MM-DD'),
      // @ts-ignore
      newDateRangeValue?.[1]?.format('YYYY-MM-DD'),
    ]);
  });
  const { instanceList, requestInstancesLoading, refreshTaskInstances } = useRequestGetUserPackageTaskInstances({
    taskId,
    filterStartDate: filterDateRange?.[0],
    filterEndDate: filterDateRange?.[1],
    onSuccess: (data: any) => {
      const maxRefreshCount = 20; // 自动刷新分群实例列表最大次数
      const refreshTimeout = 60 * 1000; // 自动刷新的时间间隔
      const currentRefreshCount = getRefreshInstanceListCount();
      const { instanceList } = data ?? {};
      if (some(instanceList, (instance) => instance.download_status === 'loading')) {
        if (currentRefreshCount < maxRefreshCount) {
          delay(() => {
            setRefreshInstanceListCount((count) => count + 1);
            refreshTaskInstances();
            message.info('当前已自动为您刷新分群提包统计');
            console.log(`当前是第${currentRefreshCount + 1}次刷新分群实例列表`);
          }, refreshTimeout);
        } else {
          message.info('当前有分群详情下载任务仍在准备中，请稍后自行刷新页面查看结果');
          console.log(`当前已超过设定的自动刷新分群实例列表最大次数，已停止自动刷新机制`);
        }
      }
    },
  });

  const chartData = useCreation(
    () =>
      map(instanceList, (item) => ({
        key: moment(item.start_time).format('YYYY-MM-DD'),
        value: item.match_uin_cnt,
      })),
    [instanceList],
  );

  return {
    instanceList,
    requestInstancesLoading,
    chartData,
    onFilterDateRangeChange,
  };
}
