export const taskTypeOptions = [
  { value: 'extract', label: '标签圈选' },
  { value: 'upload', label: '文件导入' },
  { value: 'pkg_import', label: '分群交并差' },
  { value: 'sql', label: 'SQL创建' },
];
export const taskTypeRouteMap = {
  extract: 'edit',
  upload: 'upload',
  pkg_import: 'pkg_import',
  sql: 'sql_import',
};

export const packageTemplateList = [
  {
    label: '分群详情模版',
    value: 'tag_list',
  },
  {
    label: '标签圈选模版',
    value: 'user_package',
  },
];

/* 运行状态 */
export const userPackageTaskStatusOptions = [
  { value: 'init', label: '初始化中', isFilter: true },
  { value: 'data_not_ready', label: '数据未准备好', isFilter: false },
  { value: 'pre_calc', label: '预计算', isFilter: false },
  {
    value: 'running',
    label: '提取中',
    isFilter: true,
    tipsForListTable: '提取时间不超过半小时，请耐心等候',
  },
  {
    value: 'exceed_limit',
    label: '提取超额',
    isFilter: true,
  },
  { value: 'error', label: '提取失败', isFilter: true },
  { value: 'stop', label: '已停止', isFilter: true },
  { value: 'done', label: '已完成', isFilter: true },
  { value: 'create_table_error', label: '创建表错误', isFilter: false },
  { value: 'data_extract_error', label: '分群数据提取失败', isFilter: false },
  { value: 'match_data_error', label: '匹配撞库失败', isFilter: false },
];

export const userIdTypeOptions = [
  { value: 'uin', label: '云账号UIN', disabled: false },
  { value: 'company', label: '企业SID', disabled: false },
  { value: 'phone', label: '电话号码', disabled: true },
];

export const periodTypeOptions = [
  { value: 'once', label: '一次性提取' },
  { value: 'day', label: '每日提取' },
];

export const extractionRatio = [
  { value: 50, label: '50%' },
  { value: 60, label: '60%' },
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
  // { value: 101, label: '100%以上' },
];

export const instanceStatusOptions = [
  { value: 'running', label: '提取中' },
  { value: 'done', label: '提取成功' },
  { value: 'error', label: '提取失败' },
  { value: 'exceed_limit', label: '数量超出限制' },
  { value: 'data_not_ready', label: '数据未准备好' },
];

export const dataTypeOptions = [
  { value: 'uin', label: 'uin' },
  { value: 'company', label: '企业名称' },
];

export const defaultPeriodForOnce = '10:30:00';

export const instanceDetailGlobalPortraitTagFieldNameInLayout = 'instanceDetailGlobalPortraitTag';
