import { isNumber, isString, toString, isArray, map } from 'lodash';
import { judgeDateTypeForFrontendTagRule, DateType, locateShortcutOption } from './dateParamValueConvert';

export function convertForCascader(originTagId: string, originOp: string, originValue: string[]) {
  const tagIdList = originTagId.split('|').map((item) => parseInt(item, 10));
  const logic = originOp === '=' ? 'OR' : 'AND';
  const items = tagIdList
    .map((tagId, index) => {
      const item = {
        id: tagId,
        op: originOp,
        value: originValue.filter((itemArr) => itemArr?.length === index + 1).map((arr) => arr[arr.length - 1]),
      };

      return item.value.length === 0 ? null : item;
    })
    .filter((item) => item !== null);

  if (items?.length > 1) {
    return {
      logic,
      items,
    };
  }

  return items[0];
}

export function convertForDouble(originOp: string, originValue: string) {
  let value;
  if (isNumber(originValue) || (isString(originValue) && !!originValue)) {
    value = [toString(originValue)];
  } else if (isArray(originValue)) {
    value = map(originValue, (item) => toString(item));
  }

  return { op: originOp, value };
}

/**
 * 将antd日期选择器得到的Moment值格式化成指定格式
 * 注意：
 * - 目前仅在行为条件相关的date_range字段会用到 YYYY-MM-DD 的格式，其它部分都用的是 YYYYMMDD
 * - 本方法有可能在没有op（操作符）的场景下使用，因此不能根据op来判断
 * @param {Object} node 节点
 * @param {String} valueAttrName 节点value字段名称
 * @param {String} dateFormat 日期格式化格式
 */
export function convertForDate(originOp: string, originValue: any, dateFormat = 'YYYY-MM-DD') {
  let value = originValue;
  let op = originOp;
  const dateType = judgeDateTypeForFrontendTagRule(value);
  // eslint-disable-next-line default-case
  switch (dateType) {
    case DateType.StaticDate: {
      value = [value.format(dateFormat)];
      break;
    }
    case DateType.StaticDateRange: {
      value = [originValue[0].format(dateFormat), originValue[1].format(dateFormat)];
      op = 'BETWEEN';
      break;
    }
    case DateType.DynamicDateShotcut: {
      const { startDate, endDate } = locateShortcutOption({ value });
      value = [`\${${startDate}}`, `\${${endDate}}`];
      op = 'BETWEEN';
      break;
    }
    case DateType.DynamicDateRange:
      value.sort((a: number, b: number) => b - a);
      op = 'BETWEEN';
      value = value.map((item: number) => `\${${item}}`);
      break;
  }

  return { op, value };
}

export function convertForString(originOp: string, originValue: string) {
  return {
    op: originOp,
    value: isString(originValue) ? [originValue] : originValue,
  };
}

export const CONVERT_FUNC_MAP = {
  DOUBLE: convertForDouble,
  DATE: convertForDate,
  STRING: convertForString,
  BOOL: convertForString,
};
