import request from 'utils/fetch';

/**
 * 获取当前用户staff
 */
export const getCurrentStaffName = () => request<string>({ url: `/public/get_current_staffName`, method: 'get' });
