import request from 'utils/fetch';
import { RespQueryStaffByNameItem, ResQueryStaffParams } from 'types/clueTask.type';

/**
 * 获取员工姓名
 * @param searchVal
 * @returns
 */
export const queryStaffByName = (searchVal: ResQueryStaffParams) =>
  request<RespQueryStaffByNameItem[]>({
    url: `/clue-tasks/query_staff_byname`,
    method: 'post',
    data: searchVal,
  });
