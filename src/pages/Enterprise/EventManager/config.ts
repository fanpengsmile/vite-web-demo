export const boolTypeFieldOptions = [
  { value: 1, label: '是' },
  { value: 0, label: '否' },
];

export const sourceTypeOptions = [{ value: 'EVENT', label: '事件表' }];

export const statusOptions = [
  { label: '正常', value: 'ONLINE' },
  { label: '已下线', value: 'OFFLINE' },
];

export const fieldTypeOptions = [
  { value: 'STRING', label: '字符串' },
  { value: 'DATE', label: '日期' },
  { value: 'BOOL', label: '布尔' },
  { value: 'DOUBLE', label: '数值' },
];

export const propertyTypeOptions = [
  { label: '维度类型', value: 'DIM' },
  { label: '统计类型', value: 'STATIC' },
  { label: '计算类型', value: 'CALCULATE' },
];

export const staticTypeOptions = [
  { label: '去重操作', value: 'COUNT DISTINCT' },
  { label: '计数操作', value: 'COUNT' },
  { label: '求和操作', value: 'SUM' },
  { label: '最大操作', value: 'MAX' },
  { label: '最小操作', value: 'MIN' },
  { label: '平均值操作', value: 'AVG' },
];
