/**
 * 群体画像 - 堆叠柱状图
 *
 * @author: peytonfan
 */

import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import echarts from '@tencent/act-echarts/lib/echarts';
import '@tencent/act-echarts/lib/chart/bar';
import '@tencent/act-echarts/lib/component/tooltip';
import '@tencent/act-echarts/lib/component/title';
import '@tencent/act-echarts/lib/component/dataZoom';
import '@tencent/act-echarts/lib/component/dataZoomInside';
import registerTheme, { subString, SPLIT_AXIS_TICK_PARAMS, buildDataZoomParams, IChartProps } from './config';
import { get, find, forEach, sumBy, isFunction, isEmpty } from 'lodash';
import { useCreation } from 'ahooks';

registerTheme(echarts); // 配置echarts主题

/**
 * 重新整理用来渲染堆叠柱状图的数据
 * @param {Array} originDisplayResult 画像结果
 * @param {Function} calValueFunc 计算value的方法，供PercentStackingBar组件使用
 * @returns 横轴和纵轴的数据
 */
function useDisplayResult(originDisplayResult: any, calValueFunc: any) {
  const xAxisArr: any = [];
  const seriesArr: any = [];
  forEach(originDisplayResult, (resultItem) => {
    const { key, value } = resultItem;
    xAxisArr.push(key);
    const currentTotal = sumBy(value, 'value');
    forEach(value, (valueItem) => {
      const { key, value: originValue } = valueItem;
      const value = isFunction(calValueFunc) ? calValueFunc({ total: currentTotal, ...valueItem }) : originValue;
      const seiresItem = find(seriesArr, { name: key });
      if (isEmpty(seiresItem)) {
        seriesArr.push({
          name: key,
          type: 'bar',
          stack: 'total',
          data: [value],
        });
      } else {
        seiresItem.data.push(value);
      }
    });
  });

  return { xAxisArr, seriesArr };
}

export default function StackingBarChart(props: IChartProps) {
  const { primaryKey, displayResult: originDisplayResult, chartHeight = '300px', calValueFunc, yAxisParams } = props;
  const displayResult = useDisplayResult(originDisplayResult, calValueFunc);
  const echartsOption = useCreation(() => {
    return {
      ...buildDataZoomParams(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter(chartItems: any) {
          const axisValue = get(chartItems, '0.axisValue', '');
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { value: items } = find(originDisplayResult, {
            key: axisValue,
          });
          let tooltipHtml = `<div>${axisValue}</div>`;
          forEach(chartItems, (chartItem) => {
            const { marker, seriesName } = chartItem;
            const { ratio, value } = find(items, { key: seriesName }) || {};
            tooltipHtml += `
                                <div>${marker}${seriesName}：${value.toLocaleString()}(${ratio}%)</div>
                            `;
          });
          return tooltipHtml;
        },
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
          data: get(displayResult, 'xAxisArr', []),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            interval: 'auto',
            rotate: 30,
            formatter(value: string) {
              return subString(value, 10); // 截取20个字节，避免由于名称过长导致图形显示异常
            },
          },
          nameTextStyle: {
            fontWeight: '100',
          },
        },
      ],
      yAxis: {
        ...yAxisParams,
        ...SPLIT_AXIS_TICK_PARAMS,
      },
      series: get(displayResult, 'seriesArr', []),
    };
  }, [displayResult, originDisplayResult]);
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
    />
  );
}

StackingBarChart.displayName = 'StackingBarChart';
