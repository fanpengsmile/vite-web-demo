import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

moment.updateLocale('zh-cn', {
  week: { dow: 1 },
});

export const RANGE = {
  昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  本周: [moment().startOf('week'), moment().endOf('week')],
  上周: [
    moment()
      .week(moment().week() - 1)
      .startOf('week'),
    moment()
      .week(moment().week() - 1)
      .endOf('week'),
  ],
  本月: [moment().startOf('month'), moment().endOf('month')],
  上月: [
    moment()
      .month(moment().month() - 1)
      .startOf('month'),
    moment()
      .month(moment().month() - 1)
      .endOf('month'),
  ],
  本年: [moment().startOf('year'), moment().endOf('year')],
  去年: [
    moment()
      .year(moment().year() - 1)
      .startOf('year'),
    moment()
      .year(moment().year() - 1)
      .endOf('year'),
  ],
  过去7天: [moment().subtract(7, 'days'), moment()],
  过去30天: [moment().subtract(30, 'days'), moment()],
  过去90天: [moment().subtract(90, 'days'), moment()],
};

export const DateRange = ({ className, disabled = false, value, width = 300, onChange }: any) => {
  // if (
  //   !isEmpty(value) &&
  //   (!moment.isMoment(value[0]) || !moment.isMoment(value[1]))
  // )
  //   return null

  return (
    <DatePicker.RangePicker
      className={className}
      disabled={disabled}
      value={value}
      onChange={onChange}
      // value={RANGE}
      style={{ width }}
    />
  );
};
DateRange.displayName = 'DateRange';
