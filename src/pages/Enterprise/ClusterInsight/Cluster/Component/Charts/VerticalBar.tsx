/**
 * 群体画像 - 柱状图
 *
 * @author: peytonfan
 */

import React, { useMemo, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import echarts from '@tencent/act-echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import '@tencent/act-echarts/lib/chart/bar';
import '@tencent/act-echarts/lib/component/tooltip';
import '@tencent/act-echarts/lib/component/title';
import '@tencent/act-echarts/lib/component/dataZoom';
import '@tencent/act-echarts/lib/component/dataZoomInside';
import registerTheme, {
  subString,
  // COLOR_LIST,
  SPLIT_AXIS_TICK_PARAMS,
  buildDataZoomParams,
  bindClickEventOnZr,
  IChartProps,
} from './config';
// import { usePersistFn } from '@umijs/hooks'
import { map, isFunction } from 'lodash';

registerTheme(echarts); // 配置echarts主题

export default function VerticalBar(props: IChartProps) {
  const {
    primaryKey,
    fieldType,
    displayResult,
    chartHeight = '300px',
    axisToolTipFormatter,
    handleDrill,
    index,
  } = props;

  const echartsOption = useMemo(() => {
    /* 以时间维度为横轴的统计图去掉动态筛选轴 */
    const dataZoomParams = fieldType === 'DATE' ? buildDataZoomParams() : {};

    return {
      ...dataZoomParams,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: axisToolTipFormatter,
      },
      grid: {
        top: 10,
        right: 20,
        left: 30,
        bottom: 20,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          name: '',
          data: map(displayResult, (item) => item.key),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 'auto',
            rotate: 30,
            formatter(value: string) {
              return subString(value, 20); // 截取20个字节，避免由于名称过长导致图形显示异常
            },
          },
          nameTextStyle: {
            fontWeight: '100',
          },
        },
      ],
      yAxis: {
        type: 'value',
        name: '',
        ...SPLIT_AXIS_TICK_PARAMS,
      },
      series: [
        {
          name: '用户数',
          type: 'bar',
          barWidth: '40%',
          data: map(displayResult, (item) => item.value),
          itemStyle: {
            normal: {
              /* 实现前两种颜色的交替显示 */
              // color: (params) => {
              //   const { dataIndex } = params
              //   const index = dataIndex % 2 === 0 ? 0 : 1
              //   return COLOR_LIST[index]
              // },
              color: '#1890ff',
            },
          },
        },
      ],
    };
  }, [axisToolTipFormatter, displayResult, fieldType]);

  const handleChartReady = useCallback((echarts) => {
    if (isFunction(handleDrill)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bindClickEventOnZr({
        echarts,
        chartType: 'verticalBar',
        handleDrill,
        index,
      });
    }
  }, []);

  return (
    <ReactEchartsCore
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      key={primaryKey}
      style={{ height: chartHeight }}
      echarts={echarts}
      option={echartsOption}
      notMerge={true}
      lazyUpdate={false}
      theme='dianshi'
      onChartReady={handleChartReady}
    />
  );
}

VerticalBar.displayName = 'VerticalBar';
