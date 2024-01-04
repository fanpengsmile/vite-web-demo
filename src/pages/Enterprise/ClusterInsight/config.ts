export const createType = [
  {
    value: 'extract',
    label: '企业圈选',
  },
  {
    value: 'pkg_import',
    label: '分群导入',
  },
  {
    value: 'upload',
    label: '文件导入',
  },
];

export const column = [
  {
    title: 'CID',
    dataIndex: 'cid',
    width: 130,
    fixed: 'left',
  },
  {
    title: '公司名称',
    dataIndex: 'company',
    width: 130,
    fixed: 'left',
  },
  {
    title: 'UIN',
    dataIndex: 'uin',
    width: 90,
    fixed: 'left',
  },
  {
    title: '所属',
    dataIndex: 'property',
    width: 80,
  },
];

export const status = [
  {
    value: 'init',
    label: '初始化',
  },
  {
    value: 'running',
    label: '运行中',
  },
  {
    value: 'done',
    label: '完成',
  },
  {
    value: 'error',
    label: '提取失败',
  },
];

export const LIMIT_OPTIONS = [
  { value: 5, label: '前5项' },
  { value: 10, label: '前10项' },
  { value: 15, label: '前15项' },
  { value: 20, label: '前20项' },
  { value: 25, label: '前25项' },
  { value: 30, label: '前30项' },
];

export const TOTAL_CHART_TYPE = [
  { value: 'verticalBar', label: '垂直柱状图', icon: 'bar-chart' },
  { value: 'horizontalBar', label: '水平柱状图', icon: 'bar-chart' },
  { value: 'doughnut', label: '环形图', icon: 'pie-chart' },
  { value: 'stackingBar', label: '堆叠柱状图', icon: 'bar-chart' },
  {
    value: 'percentStackingBar',
    label: '百分比堆叠柱状图',
    icon: 'percentage',
  },
];

export const TIME_GROUP_TYPE_OPTIONS = [
  { value: 'DAY', label: '按天' },
  // { value: 'WEEK', label: '按周' },
  { value: 'MONTH', label: '按月' },
  // { value: 'QUARTER', label: '按季度' },
  { value: 'YEAR', label: '按年' },
];

export const ORDER_OPTIONS = [
  { value: 'TAG_RESULT|ASC', label: '按覆盖人数升序' },
  { value: 'TAG_RESULT|DESC', label: '按覆盖人数降序' },
  { value: 'TAG_NAME|ASC', label: '按标签值升序' },
  { value: 'TAG_NAME|DESC', label: '按标签值降序' },
];
