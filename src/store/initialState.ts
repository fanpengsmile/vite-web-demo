export interface State {
  menuCollapsed?: boolean; // 菜单是否收起  true:收起   false:未收起
  isShowBreadcrumb?: boolean; // 是否显示面包屑
  currentStaffName: string; // 当前登录员工的姓名
  follower: string; // 任务关注人
  initEnterpriseState: any;
}

export const initialState: State = {
  menuCollapsed: false, // 菜单是否收起  true:收起   false:未收起
  isShowBreadcrumb: true, // 是否显示面包屑
  currentStaffName: '', // 当前登录员工的姓名
  follower: '', // 任务关注人
  initEnterpriseState: {},
};
