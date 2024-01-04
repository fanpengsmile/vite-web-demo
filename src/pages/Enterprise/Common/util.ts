// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import qs from 'query-string';
import { useMount } from 'ahooks';
import { eventTrackingReport } from 'services/enterprise';
import { IRouterMeta } from 'router';

export function getUrlSearchParams(location: null | { search: string } = null) {
  const searchStr = location ? location.search : window.location.search;
  return qs.parse(searchStr);
}

export const EVENT_TYPE_MAP = {
  button: '点击按钮',
  login: '登录',
  access: '访问',
  request: '查询',
};

export const REQUEST_RESULT_MAP = {
  failed: '失败',
  success: '成功',
};

export function usePvReport(meta: IRouterMeta, url: string, custom?: any) {
  if (meta?.need_pv_report) {
    useMount(() => {
      eventTrackingReport({
        level1_module: meta?.level1_module,
        level2_module: meta?.level2_module,
        level3_module: meta?.level3_module,
        path: url,
        event_detail: meta?.title,
        event_type: 'access',
        from_system: window.top === window.self ? '商机' : '其他',
        ...(custom || {}),
      });
    });
  }
}

export function getLabelFromOptionList(optionList: any, value: string, valueName = 'value', labelName = 'label') {
  return optionList.find((option: { [key in string]: string }) => option[valueName] === value)?.[labelName] ?? value;
}
