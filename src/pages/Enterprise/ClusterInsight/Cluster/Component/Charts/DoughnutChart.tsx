/**
 * 群体画像 - 饼图
 *
 * @author: peytonfan
 */

import React, { useMemo, useCallback } from 'react';
import { map, isFunction } from 'lodash';
import ReactEchartsCore from 'echarts-for-react/lib/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import echarts from '@tencent/act-echarts/lib/echarts';
import '@tencent/act-echarts/lib/chart/pie';
import '@tencent/act-echarts/lib/component/tooltip';
import '@tencent/act-echarts/lib/component/title';
import '@tencent/act-echarts/lib/component/toolbox';
import registerTheme, { bindClickEvent, IChartProps } from './config';

registerTheme(echarts); // 配置echarts主题

export default function DoughnutChart({
  primaryItemName,
  primaryKey,
  displayResult,
  chartHeight = '300px',
  axisToolTipFormatter,
  handleDrill,
  index,
}: IChartProps) {
  const echartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: axisToolTipFormatter,
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: primaryItemName,
          type: 'pie',
          radius: ['35%', '50%'],
          borderColor: '#eee',
          center: ['50%', '60%'],
          hover: true,
          label: {
            normal: {
              // formatter: '{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter({ name, percent, value }: { name: string; percent: string; value: string }) {
                return `{hr|}\n  {b|${name}：}${value.toLocaleString()}  {per|${percent}%}  `;
              },
              backgroundColor: '#eee',
              rich: {
                hr: {
                  width: '100%',
                  height: 0,
                },
                b: {
                  fontSize: 12,
                  lineHeight: 20,
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2,
                },
              },
            },
          },
          data: map(displayResult, (item) => ({
            name: item.key,
            value: item.value,
          })),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }),
    [axisToolTipFormatter, displayResult, primaryItemName],
  );

  const handleChartReady = useCallback((echarts) => {
    if (isFunction(handleDrill)) {
      bindClickEvent({
        echarts,
        chartType: 'doughnutChart',
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
      theme='dianshi'
      style={{ height: chartHeight }}
      echarts={echarts}
      option={echartsOption}
      notMerge={true}
      lazyUpdate={false}
      onChartReady={handleChartReady}
    />
  );
}

DoughnutChart.displayName = 'DoughnutChart';
