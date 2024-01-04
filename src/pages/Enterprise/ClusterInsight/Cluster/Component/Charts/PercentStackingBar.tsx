import React from 'react';
import StackingBarChart from './StackingBarChart';
import { calCoverage, IChartProps } from './config';

function calValueFunc({ total, value }: { total: number; value: number }) {
  return calCoverage(value, total);
}

export default function PercentStackingBarChart(props: IChartProps) {
  const yAxisParams = {
    axisLabel: {
      formatter: `{value}%`,
    },
    max: 100,
    min: 0,
  };
  return <StackingBarChart {...props} valueAttr='ratio' calValueFunc={calValueFunc} yAxisParams={yAxisParams} />;
}
PercentStackingBarChart.displayName = 'PercentStackingBarChart';
