import { isString, find, isArray, get, set, has, trim, map, isNumber, includes } from 'lodash';
import moment from 'moment';
import dayjs from 'dayjs';

export function isTimeFormat(str: string) {
  const REGEXP1 = /^\d{4}-\d{2}-\d{2}/; // 正则不要太严格，适配'2021-04-20T09:11:26.074Z'这样的格式
  const REGEXP2 = /^\d{8}$/; // 适配'20200101'
  if (!isString(str)) return false;
  return REGEXP1.test(str) || REGEXP2.test(str);
}

export const DYNAMIC_DATE_SHORTCUT_OPTIONS_LIST = [
  { label: '今天', value: 'today', startDate: 'today', endDate: 'today' },
  {
    label: '昨天',
    value: 'yesterday',
    startDate: 'yesterday',
    endDate: 'yesterday',
  },
  {
    label: '本周',
    value: 'this_week',
    startDate: 'this_week_first',
    endDate: 'this_week_end',
  },
  {
    label: '上周',
    value: 'last_week',
    startDate: 'last_week_first',
    endDate: 'last_week_end',
  },
  {
    label: '本月',
    value: 'this_month',
    startDate: 'this_month_first',
    endDate: 'this_month_end',
  },
  {
    label: '上月',
    value: 'last_month',
    startDate: 'last_month_first',
    endDate: 'last_month_end',
  },
  {
    label: '今年',
    value: 'this_year',
    startDate: 'this_year_first',
    endDate: 'this_year_end',
  },
  {
    label: '上年',
    value: 'last_year',
    startDate: 'last_year_first',
    endDate: 'last_year_end',
  },
  {
    label: '最近7天',
    value: 'recent_7days',
    startDate: 'recent_7days',
    endDate: 'today',
  },
  {
    label: '最近30天',
    value: 'recent_30days',
    startDate: 'recent_30days',
    endDate: 'today',
  },
  {
    label: '最近90天',
    value: 'recent_90days',
    startDate: 'recent_90days',
    endDate: 'today',
  },
  {
    label: '不限时间',
    value: 'unlimited_time',
    startDate: 'unlimited_time',
    endDate: 'unlimited_time',
  },
];
export const DateType = {
  StaticDate: 'staticDate', // 静态时间
  StaticDateRange: 'staticDateRange', // 静态时间区间
  DynamicDateShotcut: 'dynamicDateShotcut', // 动态时间快捷方式
  DynamicDateRange: 'dynamicDateRange', // 动态时间区间
  Unknown: 'unknown', // 未知
};
const RegTimeNumberWrap = /^\$\{\d+\}|\$\{-\d+\}$/;
export function locateShortcutOption({ value, startDate }: { value?: string; startDate?: string }) {
  const emptyOption = { label: '', value: '', startDate: '', endDate: '' };
  if (value) {
    return find(DYNAMIC_DATE_SHORTCUT_OPTIONS_LIST, { value }) || emptyOption;
  }
  if (startDate) {
    return find(DYNAMIC_DATE_SHORTCUT_OPTIONS_LIST, { startDate }) || emptyOption;
  }

  return emptyOption;
}

// 根据value判断当前是DynamicDateRange还是DynamicDateShotcut类型
// eslint-disable-next-line max-len
function judgeDynamicDateRangeOrDynamicDateShotcut(value: string[]) {
  const [stime, etime] = value;
  if (
    RegTimeNumberWrap.test(stime) ||
    RegTimeNumberWrap.test(etime) ||
    // eslint-disable-next-line no-template-curly-in-string
    (stime === '${unlimited_time}' && etime === '${today}')
  ) {
    return DateType.DynamicDateRange;
  }
  return DateType.DynamicDateShotcut;
}

/**
 * 判断后端TagRule中的Date数据类型值属于哪个种类：
 * - staticDate：静态时间
 * - staticDateRange：静态时间区间
 * - dynamicDateShotcut：动态时间快捷方式
 * - dynamicDateRange：动态时间区间
 */
export function judgeDateTypeForBackendTagRule(value: string[]) {
  if (isArray(value)) {
    if (value.length === 1) {
      if (isTimeFormat(value[0])) {
        return DateType.StaticDate;
      }
      return DateType.Unknown;
    }
    if (value.length === 2) {
      if (!isTimeFormat(value[0])) {
        return judgeDynamicDateRangeOrDynamicDateShotcut(value);
      }

      return DateType.StaticDateRange;
    }
  }

  return DateType.Unknown;
}

/**
 * 校验Date数据类型的value
 * - 不需要检验静态时间和动态时间快捷方式这两种场景，在这两种场景下只要有值就OK了
 */
// export function verifyForDate(node, valueAttrName = 'value') {
//   const value = get(node, valueAttrName)
//   const EXCEPTION = { msg: '日期区间起始值不能大于等于区间结束值' }
//   if (isArray(value) && value.length === 2) {
//     /* 针对静态时间段 */
//     if (judgeIsMomentInstance(value[0]) && judgeIsMomentInstance(value[1])) {
//       if (!value[0].isSameOrBefore(value[1])) {
//         throw EXCEPTION
//       }
//       return
//     }
//   }
// }

/**
 * 将antd日期选择器得到的Moment值格式化成指定格式
 * 注意：
 * - 目前仅在行为条件相关的date_range字段会用到 YYYY-MM-DD 的格式，其它部分都用的是 YYYYMMDD
 * - 本方法有可能在没有op（操作符）的场景下使用，因此不能根据op来判断
 * @param {Object} node 节点
 * @param {String} valueAttrName 节点value字段名称
 * @param {String} dateFormate 日期格式化格式
 */
// export function convertForDate(
//   node,
//   valueAttrName = 'value',
//   dateFormate = 'YYYYMMDD',
// ) {
//   const value = get(node, valueAttrName)
//   const dateType = judgeDateTypeForFrontendTagRule(value)
//   switch (dateType) {
//     case DateType.StaticDate:
//       set(node, valueAttrName, [value.format(dateFormate)])
//       break
//     case DateType.StaticDateRange:
//       set(node, `${valueAttrName}.0`, value[0].format(dateFormate))
//       set(node, `${valueAttrName}.1`, value[1].format(dateFormate))
//       has(node, 'op') && set(node, 'op', 'BETWEEN') // 此时若有op，则op为'BETWEEN STATIC TIME'，不符合后端接口格式，需要转换
//       has(node, 'aggr_op') &&
//         valueAttrName === 'aggr_value' &&
//         set(node, 'aggr_op', 'BETWEEN') // 此时若有aggr_op，则aggr_op为'BETWEEN STATIC TIME'，不符合后端接口格式，需要转换
//       break
//     case DateType.DynamicDateShotcut:
//       ;(() => {
//         const { startDate, endDate } = locateShortcutOption({ value })
//         set(node, valueAttrName, [`\${${startDate}}`, `\${${endDate}}`])
//         has(node, 'op') && set(node, 'op', 'BETWEEN') // 此时若有op，则op为'RECENT'，不符合后端接口格式，需要转换
//         has(node, 'aggr_op') &&
//           valueAttrName === 'aggr_value' &&
//           set(node, 'aggr_op', 'BETWEEN')
//       })()
//       break
//     case DateType.DynamicDateRange:
//       value.sort((a, b) => b - a)
//       set(node, `${valueAttrName}.0`, `\${${value[0]}}`)
//       set(node, `${valueAttrName}.1`, `\${${value[1]}}`)
//       has(node, 'op') && set(node, 'op', 'BETWEEN') // 此时若有op，则op为'BETWEEN DYNAMIC TIME'，不符合后端接口格式，需要转换
//       has(node, 'aggr_op') &&
//         valueAttrName === 'aggr_value' &&
//         set(node, 'aggr_op', 'BETWEEN')
//       break
//   }
// }

export function convertToFrontendForDate(node: { [key in string]: string[] }, valueAttrName = 'value') {
  const value = get(node, valueAttrName);
  const dateValueType = judgeDateTypeForBackendTagRule(value);
  // eslint-disable-next-line default-case
  switch (dateValueType) {
    case DateType.StaticDate: // 静态时间
      set(node, valueAttrName, moment(value[0]));
      break;

    case DateType.StaticDateRange: // 静态时间区间
      // eslint-disable-next-line no-unused-expressions
      has(node, 'op') && set(node, 'op', 'BETWEEN STATIC TIME'); // 前端使用'BETWEEN STATIC TIME'而非'BETWEEN'
      // eslint-disable-next-line no-unused-expressions
      has(node, 'aggr_op') && valueAttrName === 'aggr_value' && set(node, 'aggr_op', 'BETWEEN STATIC TIME');
      set(node, valueAttrName, [moment(value[0]), moment(value[1])]);
      break;

    case DateType.DynamicDateShotcut: // 动态时间快捷方式
      (() => {
        const { value: valueForFrontend } = locateShortcutOption({
          startDate: trim(value[0], '${}'),
        });
        set(node, valueAttrName, valueForFrontend);
        // eslint-disable-next-line no-unused-expressions
        has(node, 'op') && set(node, 'op', 'RECENT'); // 前端使用'RECENT'而非'BETWEEN'
        // eslint-disable-next-line no-unused-expressions
        has(node, 'aggr_op') && valueAttrName === 'aggr_value' && set(node, 'aggr_op', 'RECENT');
      })();
      break;

    case DateType.DynamicDateRange: // 动态时间区间
      // eslint-disable-next-line no-unused-expressions
      has(node, 'op') && set(node, 'op', 'BETWEEN DYNAMIC TIME'); // 前端使用'BETWEEN DYNAMIC TIME'而非'BETWEEN'
      // eslint-disable-next-line no-unused-expressions
      has(node, 'aggr_op') && valueAttrName === 'aggr_value' && set(node, 'aggr_op', 'BETWEEN DYNAMIC TIME');
      set(
        node,
        valueAttrName,
        map(value, (item) => {
          const numberStr = trim(item, '${}');
          if (RegTimeNumberWrap.test(item)) {
            return parseInt(numberStr, 10);
          }
          return numberStr;
        }),
      );
      break;
  }
}

/*
    为伪前端tagRule转化成真前端tagRule准备的Date类型值转换：
    - moment对象被JSON.stringify后会变成字符串，因此需要转回moment对象；注意排除掉动态时间的情况
    - 不用考虑动态时间快捷方式
*/
export function convertFakeFontendToRealFrontendForDate(node: { [key in string]: string }, valueAttrName = 'value') {
  const value = get(node, valueAttrName);
  if (isTimeFormat(value)) {
    /* 静态时间 */
    set(node, valueAttrName, moment(value));
  } else if (isArray(value) && isTimeFormat(value[0]) && isTimeFormat(value[1])) {
    /* 需要排除掉“动态时间”的情况，因此需要正则判断一下，动态时间格式为[2, 1]（表示过去2天至过去1天） */
    set(
      node,
      valueAttrName,
      map(value, (item) => moment(item)),
    );
  }
}

/**
 * 判断前端TagRule中的Date数据类型值属于哪个种类：
 * - staticDate：静态时间
 * - staticDateRange：静态时间区间
 * - dynamicDateShotcut：动态时间快捷方式
 * - dynamicDateRange：动态时间区间
 */
export function judgeDateTypeForFrontendTagRule(value: string[]) {
  if (isArray(value) && value.length === 2) {
    if (moment.isMoment(value[0]) && moment.isMoment(value[1])) {
      return DateType.StaticDateRange;
    }
    if (
      (isNumber(value[0]) || value[0] === 'unlimited_time' || value[0] === 'today') &&
      (isNumber(value[1]) || value[1] === 'today')
    ) {
      return DateType.DynamicDateRange;
    }
    return DateType.Unknown;
  }
  if (moment.isMoment(value)) {
    return DateType.StaticDate;
  }
  if (isString(value) && value !== '') {
    // aggr_value op为‘空 不为空’默认为“”
    return DateType.DynamicDateShotcut;
  }
  return DateType.Unknown;
}

/* 判断后端TagRule中的Date数据类型值是否属于动态时间 */
export function judgeIsDynamicDateTypeForBackendTagRule(value: string[]) {
  return includes([DateType.DynamicDateShotcut, DateType.DynamicDateRange], judgeDateTypeForBackendTagRule(value));
}

export function convertDateValueForJsonEncode(originDateValue: string): string | string[] {
  if (dayjs.isDayjs(originDateValue)) {
    return originDateValue.format('YYYY-MM-DD');
  }
  if (isArray(originDateValue) && originDateValue.length > 0 && dayjs.isDayjs(originDateValue[0])) {
    return [originDateValue[0].format('YYYY-MM-DD'), originDateValue[1].format('YYYY-MM-DD')];
  }
  return originDateValue;
}

export function convertDateValueForJsonDecode(originDateValue: string | string[]) {
  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
  if (isString(originDateValue) && dateRegExp.test(originDateValue)) {
    return dayjs(originDateValue);
  }
  if (isArray(originDateValue) && dateRegExp.test(originDateValue[0]) && dateRegExp.test(originDateValue[1])) {
    return [dayjs(originDateValue[0]), dayjs(originDateValue[1])];
  }
  return originDateValue;
}
