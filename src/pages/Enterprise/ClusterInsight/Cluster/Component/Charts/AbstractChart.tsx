/**
 * 群体画像 - 统计图入口
 *
 * @author: peytonfan
 */

import React from 'react';
import VerticalBar from './VerticalBar';
import HorizontalBar from './HorizontalBar';
import DoughnutChart from './DoughnutChart';
import StackingBarChart from './StackingBarChart';
import PercentStackingBarChart from './PercentStackingBar';

export default function AbstractChart(props: any) {
  const { chartType } = props;
  switch (chartType) {
    case 'verticalBar':
      return <VerticalBar {...props} />;
    case 'horizontalBar':
      return <HorizontalBar {...props} />;
    case 'doughnut':
      return <DoughnutChart {...props} />;
    case 'stackingBar':
      return <StackingBarChart {...props} />;
    case 'percentStackingBar':
      return <PercentStackingBarChart {...props} />;
    default:
      // 默认为条形图
      return <VerticalBar {...props} />;
  }
}
