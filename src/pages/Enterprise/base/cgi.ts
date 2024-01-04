/* eslint-disable default-param-last */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import { useAntdTable, useMemoizedFn, useRequest } from 'ahooks';
import {
  isEmpty,
  isFunction,
  reduce,
  isNil,
  isObject,
  isArray,
  set,
  map,
  last,
  get,
  isNumber,
  forEach,
  keys,
  uniq,
  filter,
  orderBy,
  split,
  assign,
  find,
  includes,
  compact,
  pick,
} from 'lodash';
import { Form, message } from 'antd';
import {
  getOpportunityList,
  getFilterOptionAvailableValueList,
  getUserPackageTaskDetail,
  createUserPackageTask,
  editUserPackageTask,
  deleteUserPackageTask,
  getTagAvailableValueOptionList,
  getEventFieldOptionList,
  getEventDetailList,
  extractInnerCustomer,
  getEventList as fetchEventList,
  getTagDirList as fetchTagDirList,
  getUserPackageTaskInstanceList,
  getUserPackageInstanceDetailDataExcelDownloadUrl,
  getUserPackageInstanceDetailDataExcelAsyncDownloadUrl,
  getUserPackageTaskList,
  exportTagConfig,
  editTag,
  importTagConfig,
  getTagMetaList,
  addTag,
  modifyEventStatus,
  addEvent,
  editEvent,
  getUserPackageInstanceDetailDataList,
  startUserPackageInstanceDetailDataExcelDownload,
} from 'services/enterprise';
import {
  relatTagList,
  formFieldsRenderedAsCheckboxGroup,
  formFieldsRenderedAsSelect,
  customOptionValue,
  formFieldNameForOneCheckboxGroup,
} from '../Opportunity/config';
import moment from 'moment';

interface IKeywordSearchParams {
  keywordSearchType: string;
  keywordSearchValue: string;
}
interface ICondition {
  logic?: string;
  items?: IConditionItems[];
}

interface IOriginList {
  property_id: number;
  field_name: string;
  field_en_name: string;
  field_type: string;
  is_show: number;
}

interface IConditionItems {
  id?: number;
  field_name?: string;
  field_type?: string;
  op?: string;
  value?: string[];
}

interface IField {
  formFieldName: string;
  firstLevelFieldName: string;
  secondLevelFieldName: string;
}

/* 编辑事件：https://opc-mock.woa.com/project/553/interface/api/5749 */
export function useRequestEditEvent(onSuccess: any) {
  const { loading: requestEditEventLoading, run: runRequestEditEvent } = useRequest(
    async ({ eventId, ...restFieldsValue }) => {
      if (!eventId) {
        throw new Error('eventId是必须的');
      }
      const [res, err] = await editEvent({
        event_id: eventId,
        ...restFieldsValue,
      });
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('编辑数据源失败', e);
      },
    },
  );

  return { requestEditEventLoading, runRequestEditEvent };
}

/* 新增事件：https://opc-mock.woa.com/project/553/interface/api/5731 */
export function useRequestAddEvent(onSuccess: any) {
  const { loading: requestAddEventLoading, run: runRequestAddEvent } = useRequest(
    async (fieldsValue) => {
      const [res, err] = await addEvent(fieldsValue);
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('新增数据源失败', e);
      },
    },
  );

  return { requestAddEventLoading, runRequestAddEvent };
}

/* 事件列表查询：https://opc-mock.woa.com/project/553/interface/api/5002 */
export function useEventDetail(onSuccess: any) {
  const { loading: eventDetailLoading, run: runRequestEventDetail } = useRequest(
    async (eventId) => {
      if (!eventId) return Promise.resolve({});
      const [requestEventListRes, err] = await fetchEventList({
        event_id: eventId,
        page_index: 1,
        page_size: 1,
      });
      if (requestEventListRes && !isEmpty(requestEventListRes?.event_list?.[0])) {
        const eventDetail = requestEventListRes.event_list[0];
        const [requestEventDetailListRes, err] = await getEventDetailList({
          event_id: eventId,
        });
        if (requestEventDetailListRes) {
          return {
            eventDetail,
            evenDetailList: requestEventDetailListRes.event_list,
          };
        }
        throw requestEventDetailListRes;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取数据源详情失败', e);
      },
    },
  );

  return { eventDetailLoading, runRequestEventDetail };
}

/* 导入标签配置文件：https://opc-mock.woa.com/project/553/interface/api/5569 */
export function useRequestImportTagConfig(onSuccess: any, afterError: any) {
  const { loading: requestImportTagConfigLoading, run: runRequestImportTagConfig } = useRequest(
    async (cosBucket, cosFileName) => {
      const [res, err] = await importTagConfig({
        cos_filename: cosFileName,
        cos_bucket: cosBucket,
      });
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        isFunction(afterError) && afterError();
        showErrCodeMsg('导入标签失败', e);
      },
    },
  );

  return { requestImportTagConfigLoading, runRequestImportTagConfig };
}

export function useRequestDeleteUserPackageTask(afterSuccess: any) {
  const { loading: deleteUserPackageTaskLoading, run: runDeleteUserPackageTask } = useRequest(
    async (taskId) => {
      const [res, err] = await deleteUserPackageTask({
        task_id: taskId,
      });
      if (res) {
        return;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess: afterSuccess,
      onError(e) {
        showErrCodeMsg('删除分群任务失败', e);
      },
    },
  );

  return { deleteUserPackageTaskLoading, runDeleteUserPackageTask };
}

export function filterEmptyParams(originParams: any) {
  return reduce(
    originParams,
    (result, value, key) => {
      if (isNil(value) || value === '') return result;
      if ((isObject(value) || isArray(value)) && isEmpty(value)) return result;
      set(result, key, value);
      return result;
    },
    {},
  );
}

/* https://opc-mock.woa.com/project/553/interface/api/5020 */
export function useRequestGetUserPackageTaskList() {
  const [form] = Form.useForm();
  const {
    search,
    tableProps,
    loading: requestUserPackageTaskListLoading,
    refresh: refreshUserPackageTaskList,
  } = useAntdTable(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async (pageParams = {}, searchFormData = {}) => {
      const [res, err] = await getUserPackageTaskList({
        ...buildQueryParams(searchFormData),
        ...buildBackendPageParams(pageParams), // 整理分页参数
      });
      if (res) {
        return {
          total: res?.total ?? 0,
          list: res?.pkg_task_list ?? [],
        };
      }
      throw err;
    },
    {
      form,
      onError(e) {
        showErrCodeMsg('获取分群列表失败', e);
      },
    },
  );

  return {
    tableProps,
    form,
    search,
    requestUserPackageTaskListLoading,
    refreshUserPackageTaskList,
  };

  /* 整理分页参数 */
  function buildBackendPageParams(frontendPageParams: any) {
    const { current, pageSize } = frontendPageParams;
    return { page_index: current, page_size: pageSize };
  }

  function buildQueryParams({ taskId, search_name, creator, createTimeRange, task_type_list, status_list, desc }: any) {
    return filterEmptyParams({
      ...(taskId ? { task_id_list: [taskId] } : {}),
      search_name,
      creator,
      remark: desc,
      ...(!isEmpty(createTimeRange)
        ? {
            lower_created_at: `${createTimeRange[0].format('YYYY-MM-DD')} 00:00:00`,
            upper_created_at: `${createTimeRange[1].format('YYYY-MM-DD')} 23:59:59`,
          }
        : {}),
      task_type_list,
      status_list,
    });
  }
}

/* 编辑标签：https://opc-mock.woa.com/project/553/interface/api/5605 */
export function useRequestEditTag(onSuccess: any) {
  const { loading: requestEditTagLoading, run: runRequestEditTag } = useRequest(
    async ({ tagId, ...restFieldsValue }) => {
      if (!tagId) {
        throw new Error('tagId是必须的');
      }
      const [res, err] = await editTag({
        tag_id_list: [tagId],
        ...restFieldsValue,
      });
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('编辑标签失败', e);
      },
    },
  );

  return { requestEditTagLoading, runRequestEditTag };
}

export function useRequestAddTag(onSuccess: any) {
  const { loading: requestAddTagLoading, run: runRequestAddTag } = useRequest(
    async (tagFieldsValue) => {
      const [res, err] = await addTag(tagFieldsValue);
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('添加标签失败', e);
      },
    },
  );

  return { requestAddTagLoading, runRequestAddTag };
}

/* 获取分群详情下载URL地址：https://opc-mock.woa.com/project/553/interface/api/5875 */
export function useRequestGetUserPackageInstanceDetailDataExcelAsyncDownloadUrl(onSuccess: any) {
  const { run: runRequestGetAsyncDownloadUrl, loading: requestGetAsyncDownloadUrlLoading } = useRequest(
    async (instanceId) => {
      if (!instanceId) {
        throw new Error('必须传入instanceId参数');
      }
      const [res, err] = await getUserPackageInstanceDetailDataExcelAsyncDownloadUrl({
        inst_id: instanceId,
      });
      if (res && !!res?.url) {
        return res.url;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取分群实例具体客户列表文件下载链接失败', e);
      },
    },
  );

  return { runRequestGetAsyncDownloadUrl, requestGetAsyncDownloadUrlLoading };
}

/* 根据分群实例ID下载包详细字段数据：https://opc-mock.woa.com/project/553/interface/api/5353 */
export function useRequestGetUserPackageInstanceDetailDataExcelDownloadUrl(onSuccess: any) {
  const { run: runRequestGetDownloadUrl, loading: requestGetDownloadUrlLoading } = useRequest(
    async (instanceId, tagIdList = []) => {
      if (!instanceId) {
        throw new Error('必须传入instanceId参数');
      }
      const [res, err] = await getUserPackageInstanceDetailDataExcelDownloadUrl({
        inst_id: instanceId,
        tag_ids: tagIdList,
      });
      if (res && !!res?.url) {
        return res.url;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取分群实例具体客户列表文件下载链接失败', e);
      },
    },
  );

  return { runRequestGetDownloadUrl, requestGetDownloadUrlLoading };
}

/* 异步触发下载包详细字段数据：https://opc-mock.woa.com/project/553/interface/api/5857 */
export function useRequestStartUserPackageInstanceDetailDataExcelDownload(onSuccess: any) {
  const { run: runRequestStartDownload, loading: requestStartDownloadLoading } = useRequest(
    async (instanceId, tagIdList = []) => {
      if (!instanceId) {
        throw new Error('必须传入instanceId参数');
      }
      const [res, err] = await startUserPackageInstanceDetailDataExcelDownload({
        inst_id: instanceId,
        tag_ids: tagIdList,
      });
      if (res) {
        return;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('触发异步下载分群实例具体客户列表文件失败', e);
      },
    },
  );

  return { runRequestStartDownload, requestStartDownloadLoading };
}

/* 根据实例ID查询分群详细字段数据：https://opc-mock.woa.com/project/553/interface/api/5119 */
export function useRequestGetUserPackageInstanceDetailDataList(form: any) {
  const {
    search,
    tableProps,
    loading: requestInstanceDetailDataListLoading,
    refresh: refreshInstanceDetailDataList,
  } = useAntdTable(
    async (pageParams: any = {}, formData) => {
      const instanceId = formData?.instanceId;
      if (!instanceId) {
        return Promise.resolve({ list: [], total: 0 });
      }
      const tagIds = map(formData?.portraitTagIdListArr, (item) => last(item));
      const [res, err] = await getUserPackageInstanceDetailDataList({
        inst_id: instanceId,
        tag_ids: tagIds,
        ...buildBackendPageParams(pageParams), // 整理分页参数
      });
      if (res) {
        return {
          total: res?.total_num ?? 0,
          list: res?.data_result || [],
        };
      }
      throw err;
    },
    {
      form,
      onError(e) {
        showErrCodeMsg('获取分群实例具体客户列表失败', e);
      },
    },
  );

  return {
    tableProps,
    form,
    search,
    requestInstanceDetailDataListLoading,
    refreshInstanceDetailDataList,
  };

  /* 整理分页参数 */
  function buildBackendPageParams(frontendPageParams: any) {
    const { current, pageSize } = frontendPageParams;
    return { page_index: current, page_size: pageSize };
  }
}

export function useRequestGetUserPackageTaskInstances({ taskId, filterStartDate, filterEndDate, onSuccess }: any) {
  const {
    data,
    loading: requestInstancesLoading,
    refresh: refreshTaskInstances,
  } = useRequest(
    async () => {
      if (!taskId) return { instanceList: [], instanceOptions: [] };
      const [res, err] = await getUserPackageTaskInstanceList({
        task_id: +taskId,
        ...(filterStartDate ? { lower_start_time: filterStartDate } : {}),
        ...(filterEndDate ? { upper_start_time: filterEndDate } : {}),
        page_index: 1,
        page_size: 500,
      });
      if (res) {
        return {
          instanceList: res?.pkg_task_inst_list,
          instanceOptions: map(res?.pkg_task_inst_list, ({ inst_id: instanceId, start_time: startTime }) => ({
            value: instanceId,
            label: moment(startTime).format('YYYY-MM-DD'),
          })),
        };
      }
      throw err;
    },
    {
      refreshDeps: [taskId, filterStartDate, filterEndDate],
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取分群实例列表失败', e);
      },
    },
  );

  const { instanceList, instanceOptions } = data || {};
  return {
    instanceList,
    instanceOptions,
    requestInstancesLoading,
    refreshTaskInstances,
  };
}

export function useRequestModifyEventStatus(onSuccess: any) {
  const { loading: requestModifyEventStatusLoading, run: runRequestModifyEventStatus } = useRequest(
    async (eventId, status) => {
      const [res, err] = await modifyEventStatus({
        event_id: eventId,
        status,
      });
      if (res) {
        return res;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('修改数据源状态失败', e);
      },
    },
  );

  return { requestModifyEventStatusLoading, runRequestModifyEventStatus };
}

export function useEventManagerList(onSuccess: any) {
  const {
    data: eventList,
    loading: eventListLoading,
    refresh: refreshEventList,
  } = useRequest(
    async () => {
      const [res, err] = (await fetchEventList({ page_index: 1, page_size: 500 })) as any;
      if (res) {
        return res?.event_list ?? [];
      }
      throw err;
    },
    {
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取数据源列表失败', e);
      },
    },
  );

  return { eventList, eventListLoading, refreshEventList };
}

/* 事件列表查询：https://opc-mock.woa.com/project/553/interface/api/5002 */
export function useEventList() {
  const { data: eventList, loading: eventListLoading } = useRequest(
    async () => {
      const [res, err] = await fetchEventList({ page_index: 1, page_size: 500 });
      if (res) {
        return getEventList(res.event_list);
      }
      throw err;
    },
    {
      onError(e) {
        showErrCodeMsg('获取数据源列表失败', e);
      },
    },
  );

  return { eventList, eventListLoading };

  function getEventList(originEventList: any) {
    const filteredEventList = filterEventListForExtract(originEventList);
    const eventMap = buildEventMap(filteredEventList);
    const firstLevelDirNameList = Array.from(new Set(filteredEventList.map(({ event_first_dir }) => event_first_dir)));

    return reduce(
      firstLevelDirNameList,
      (eventList: any, firstLevelDirName) => {
        const firstLevelItem: any = {
          value: firstLevelDirName,
          label: firstLevelDirName,
        };

        const firstLevelEventMapValue = get(eventMap, firstLevelDirName);
        if (isNumber(firstLevelEventMapValue)) {
          /* 没有目录 */
          firstLevelItem.value = firstLevelEventMapValue;
        } else {
          firstLevelItem.children = [];
          forEach(keys(firstLevelEventMapValue), (secondLevelName) => {
            const secondLevelItem: any = {
              value: secondLevelName,
              label: secondLevelName,
            };
            const secondLevelEventMapValue = get(eventMap, [firstLevelDirName, secondLevelName]);
            if (isNumber(secondLevelEventMapValue)) {
              /* 只有一级目录 */
              secondLevelItem.value = secondLevelEventMapValue;
            } else {
              secondLevelItem.children = [];
              forEach(keys(secondLevelEventMapValue), (thirdLevelName) => {
                const thirdLevelItem: any = {
                  value: thirdLevelName,
                  label: thirdLevelName,
                };
                const thirdLevelEventMapValue = get(eventMap, [firstLevelDirName, secondLevelName, thirdLevelName]);
                if (isNumber(thirdLevelEventMapValue)) {
                  /* 只有二级目录 */
                  thirdLevelItem.value = thirdLevelEventMapValue;
                } else {
                  /* 有完整的三级目录 */
                  thirdLevelItem.children = [];
                  forEach(keys(thirdLevelEventMapValue), (fourthLevelName) => {
                    thirdLevelItem.children.push({
                      value: get(eventMap, [firstLevelDirName, secondLevelName, thirdLevelName, fourthLevelName]),
                      label: fourthLevelName,
                    });
                  });
                }
                secondLevelItem.children.push(thirdLevelItem);
              });
            }
            firstLevelItem.children.push(secondLevelItem);
          });
        }

        eventList.push(firstLevelItem);

        return eventList;
      },
      [],
    );
    function buildEventMap(eventList: any) {
      return reduce(
        eventList,
        (
          eventMap,
          {
            event_first_dir: eventFirstDir,
            event_second_dir: eventSecondDir,
            event_third_dir: eventThirdDir,
            event_id: eventId,
            event_name: eventName,
          },
        ) => {
          const path = uniq([eventFirstDir, eventSecondDir, eventThirdDir, eventName]);
          set(eventMap, path, eventId);
          return eventMap;
        },
        {},
      );
    }
  }

  function filterEventListForExtract(originEventList: any) {
    return filter(originEventList, (event) => event.status === 'ONLINE' && event.is_show === 1);
  }
}

/* 内部客户uin提取or预估：https://opc-mock.woa.com/project/553/interface/api/4975 */
export function useRequestExtractInnerCustomer(onSuccess: any, onError: any) {
  const { loading: extractInnerCustomerLoading, run: runExtractInnerCustomer } = useRequest(
    async (condition) => {
      if (isEmpty(condition)) {
        throw new Error('必须传入condition');
      }
      const [res, err] = await extractInnerCustomer({
        data_type: 'uin', // 现在只支持uin
        is_show_data_detail: 0,
        inner_condition: condition,
      });
      if (res) {
        return res?.total ?? 0;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        isFunction(onError) && onError();
        showErrCodeMsg('预估分群人数失败', e);
      },
    },
  );

  return { extractInnerCustomerLoading, runExtractInnerCustomer };
}

/* 编辑标签：https://opc-mock.woa.com/project/553/interface/api/5605 */
export function useRequestModifyTagStatus(onSuccess: any) {
  const { loading: requestModifyTagStatusLoading, run: runRequestModifyTagStatus } = useRequest(
    async (tagIdList, newStatus) => {
      const [res, err] = await editTag({
        tag_id_list: tagIdList,
        status: newStatus,
      });
      if (res) {
        return newStatus;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('修改标签状态失败', e);
      },
    },
  );

  return { requestModifyTagStatusLoading, runRequestModifyTagStatus };
}

/* 导出标签配置文件：https://opc-mock.woa.com/project/553/interface/api/5578 */
export function useRequestExportTagConfig(onSuccess: any) {
  const { loading: requestExportTagConfigLoading, run: runRequestExportTagConfig } = useRequest(
    async () => {
      const [res, err] = (await exportTagConfig()) as any;
      if (res && !!res?.download_url) {
        return res.download_url;
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('导出标签失败', e);
      },
    },
  );

  return { requestExportTagConfigLoading, runRequestExportTagConfig };
}

/* 标签目录列表查询：https://opc-mock.woa.com/project/553/interface/api/4984 */
export function useTagDetail(onSuccess: any, tagGroup: any) {
  const { loading: tagDetailLoading, runAsync: runAsyncRequestTagDetail } = useRequest(
    async (tagId) => {
      if (!tagId) return Promise.resolve({});
      const [res, err] = (await getTagMetaList({
        tag_id: tagId,
        page_index: 1,
        page_size: 1,
        tag_group: tagGroup,
      })) as any;
      if (res && !isEmpty(res?.tag_list?.[0])) {
        return res.tag_list[0];
      }
      throw err;
    },
    {
      manual: true,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取标签详情失败', e);
      },
    },
  );

  return { tagDetailLoading, runAsyncRequestTagDetail };
}

export function useTagDirListManual(onSuccess: any, manual = false) {
  const {
    data,
    loading: tagDirListLoading,
    runAsync: runAsyncRequestTagDirList,
    refresh,
  } = useRequest(
    async () => {
      const [res, err] = await fetchTagDirList({
        tag_group: 'ALL',
      });
      if (res) {
        if (isEmpty(res?.tag_dir_list)) {
          throw new Error('获取标签分类列表为空，请联系管理员');
        }
        const originTagDirList = res.tag_dir_list;

        const { tagDirList, tagMetaList } = getTagDirListAndTagMetaList(originTagDirList);
        return {
          tagDirList,
          tagMetaList: orderBy(tagMetaList, ['tag_id'], ['desc']),
        };
      }
      throw err;
    },
    {
      manual,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取标签分类列表失败', e);
      },
    },
  );

  return {
    ...data,
    tagDirListLoading,
    refresh,
    runAsyncRequestTagDirList,
  };

  function getTagDirListAndTagMetaList(tagDirList: any) {
    const originTagDirList: any = [];
    for (let i = 0; i < tagDirList.length; i++) {
      const item = tagDirList[i];
      const itemTagList = item.tag_list;
      if (itemTagList.length <= 1) {
        originTagDirList.push(item);
      } else {
        for (let j = 0; j < itemTagList.length; j++) {
          const itemCopy = {
            ...item,
            tag_dir_id: parseFloat(`${item.tag_dir_id}.${itemTagList[j].tag_id}`),
            dir_name: `${item.dir_name} - ${itemTagList[j].tag_name}`,
            tag_list: [itemTagList[j]],
          };
          originTagDirList.push(itemCopy);
        }
      }
    }
    const firstLevelDirList = filter(originTagDirList, { dir_level: 1 });
    return reduce(
      firstLevelDirList,
      (result, { dir_name: firstLevelDirName, tag_dir_id: firstLevelDirId }) => {
        const firstLevelDirChildren = filter(
          originTagDirList,
          ({ dir_level: dirLevel, father_id: fatherId, tag_list: tagList }) => {
            return dirLevel === 2 && fatherId === firstLevelDirId && !isEmpty(tagList);
          },
        );

        if (isEmpty(firstLevelDirChildren)) {
          return result;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.tagDirList.push({
          dirId: firstLevelDirId,
          dirName: firstLevelDirName,
          children: map(
            firstLevelDirChildren,
            ({ tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: tagList }) => ({
              dirId: secondLevelDirId,
              dirName: secondLevelDirName,
              relateTagList: tagList,
            }),
          ),
        });
        forEach(firstLevelDirChildren, (secondLevelDir) => {
          const { tag_list: tagList, tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName } = secondLevelDir;
          forEach(tagList, (tag) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result.tagMetaList.push({
              ...tag,
              firstLevelDirId,
              firstLevelDirName,
              secondLevelDirId,
              secondLevelDirName,
            });
          });
        });
        return result;
      },
      { tagDirList: [], tagMetaList: [] },
    );
  }
}

/* 标签目录列表查询：https://opc-mock.woa.com/project/553/interface/api/4993 */
export function useTagDirList(onSuccess: (data: any) => void, dataType: string, isAll?: boolean) {
  const {
    data,
    loading: tagDirListLoading,
    run: getTagDirList,
  } = useRequest(
    async () => {
      const [res, err] = await fetchTagDirList({
        // eslint-disable-next-line no-nested-ternary
        tag_group: dataType === 'ALL' ? 'ALL' : dataType === 'uin' ? 'INNER' : 'OUTER',
      });
      if (res) {
        if (isEmpty(res?.tag_dir_list)) {
          throw new Error('获取标签分类列表为空，请联系管理员');
        }
        const originTagDirList = res.tag_dir_list;
        const tagdl = getTagDirListAndTagMetaList(originTagDirList, isAll);
        return tagdl;
      }
      throw err;
    },
    {
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取标签分类列表失败', e);
      },
    },
  );

  return {
    tagDirList: data?.tagDirList,
    tagMetaList: data?.tagMetaList,
    tagDirListLoading,
    getTagDirList,
    refresh: getTagDirList,
  };

  function getTagDirListAndTagMetaList(tagDirList: any, isAll?: boolean) {
    const originTagDirList: any = [];
    for (let i = 0; i < tagDirList.length; i++) {
      const item = tagDirList[i];
      const itemTagList = item.tag_list;
      if (itemTagList.length <= 1) {
        originTagDirList.push(item);
      } else {
        for (let j = 0; j < itemTagList.length; j++) {
          const itemCopy = {
            ...item,
            tag_dir_id: parseFloat(`${item.tag_dir_id}.${itemTagList[j].tag_id}`),
            dir_name: `${item.dir_name} - ${itemTagList[j].tag_name}`,
            tag_list: [itemTagList[j]],
          };
          originTagDirList.push(itemCopy);
        }
      }
    }
    const firstLevelDirList = filter(originTagDirList, { dir_level: 1 });
    return reduce(
      firstLevelDirList,
      (result: any, { dir_name: firstLevelDirName, tag_dir_id: firstLevelDirId }) => {
        const firstLevelDirChildren = filter(
          originTagDirList,
          ({ dir_level: dirLevel, father_id: fatherId, tag_list: originTagList }) => {
            const tagList = isAll ? originTagList : filterTagListForExtract(originTagList);
            return dirLevel === 2 && fatherId === firstLevelDirId && !isEmpty(tagList);
          },
        );

        if (isEmpty(firstLevelDirChildren)) {
          return result;
        }

        result.tagDirList.push({
          dirId: firstLevelDirId,
          dirName: firstLevelDirName,
          children: map(
            firstLevelDirChildren,
            ({ tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: originTagList }) => ({
              dirId: secondLevelDirId,
              dirName: secondLevelDirName,
              relateTag: isAll
                ? originTagList
                : filterTagListForExtract(originTagList)
                    .map(({ tag_en_name }) => tag_en_name)
                    .join('|'),
            }),
          ),
        });
        forEach(firstLevelDirChildren, (secondLevelDir) => {
          const { tag_list: originTagList, dir_name: secondLevelDirName } = secondLevelDir;
          const tagList = isAll ? originTagList : filterTagListForExtract(originTagList);
          forEach(tagList, (tag) => {
            result.tagMetaList.push({
              tagId: tag.tag_id,
              fieldName: tag.tag_en_name,
              fieldCnName: tag.tag_name,
              dataType: tag.field_type,
              ...tag,
            });
          });
          // if (tagList?.length === 1) {
          //   result.tagMetaList.push({
          //     tagId: tagList[0].tag_id,
          //     fieldName: tagList[0].tag_en_name,
          //     fieldCnName: tagList[0].tag_name,
          //     dataType: tagList[0].field_type,
          //   })
          // } else
          if (!isAll && tagList?.length > 1) {
            result.tagMetaList.push({
              tagId: tagList.map(({ tag_id }: { tag_id: number; tag_en_name: string }) => tag_id).join('|'),
              fieldName: tagList
                .map(({ tag_en_name }: { tag_id: number; tag_en_name: string }) => tag_en_name)
                .join('|'),
              fieldCnName: secondLevelDirName,
              dataType: 'CASCADER',
            });
          }
        });
        return result;
      },
      { tagDirList: [], tagMetaList: [] },
    );
  }

  function filterTagListForExtract(originTagList: any) {
    return filter(originTagList, (tag) => tag.status === 'ONLINE' && tag.is_extract_show === 1);
  }
}

/* 事件详情列表查询：https://opc-mock.woa.com/project/553/interface/api/5011 */
export function useEventDetailList(eventId: number) {
  const { data: eventDetailList, loading: eventDetailListLoading } = useRequest(
    async () => {
      if (!eventId) return [];
      const [res, err] = await getEventDetailList({ event_id: eventId });
      if (err) {
        throw err;
      }
      if (isEmpty(res?.event_list)) {
        throw new Error('获取数据源详情列表为空，请联系管理员');
      }
      return format(res.event_list);
    },
    {
      refreshDeps: [eventId],
      onError(e) {
        showErrCodeMsg('获取数据源详情列表失败', e);
      },
    },
  );

  return { eventDetailList, eventDetailListLoading };

  function format(originList: any) {
    return originList
      .filter((property: IOriginList) => property.is_show === 1)
      .map(({ property_id, field_name, field_en_name, field_type }: IOriginList) => ({
        tagId: property_id,
        fieldName: field_en_name,
        fieldCnName: field_name,
        dataType: field_type,
      }));
  }
}

/* 事件字段选项查询：https://opc-mock.woa.com/project/553/interface/api/5227 */
export function useEventFieldOptionList(eventId: number, propertyId: number, enableLoad: boolean) {
  const { data: eventFieldOptionList, loading: eventFieldOptionListLoading } = useRequest(
    async () => {
      if (!eventId || !propertyId || !enableLoad) return [];
      const [res, err] = await getEventFieldOptionList({
        event_id: eventId,
        property_id: propertyId,
      });
      if (err) {
        throw err;
      }
      return map(res?.event_field_option, (value) => ({
        value,
        label: value,
      }));
    },
    {
      refreshDeps: [eventId, propertyId],
      onError(e) {
        showErrCodeMsg('获取数据源字段选项列表失败', e);
      },
    },
  );

  return { eventFieldOptionList, eventFieldOptionListLoading };
}

/* 字段选项查询：https://opc-mock.woa.com/project/553/interface/api/4441 */
export function useTagAvailableValueOptionList(tagFieldName: string, isCascader: boolean, enableLoad: boolean) {
  const { data: tagAvailableValueOptionList, loading: tagAvailableValueOptionListLoading } = useRequest(
    async () => {
      if (!enableLoad) return [];
      const [res, err] = await getTagAvailableValueOptionList({
        tagFieldNameList: isCascader ? split(tagFieldName, '|') : [tagFieldName],
      });
      if (err) {
        throw err;
      }
      return res;
    },
    {
      refreshDeps: [tagFieldName, enableLoad],
      onError(e) {
        showErrCodeMsg('获取标签可用选项列表失败', e);
      },
    },
  );
  return { tagAvailableValueOptionList, tagAvailableValueOptionListLoading };
}

export function useRequestEditUserPackageTask(afterSuccess: (data: any) => void) {
  const { loading: editUserPackageTaskLoading, run: runEditUserPackageTask } = useRequest(
    async (taskDetail) => {
      if (isEmpty(taskDetail)) {
        throw new Error('必须传入taskDetail');
      }
      const [res, err] = await editUserPackageTask(taskDetail);
      if (err) {
        throw err;
      }
    },
    {
      manual: true,
      onSuccess: afterSuccess,
      onError(e) {
        showErrCodeMsg('编辑分群任务失败', e);
      },
    },
  );

  return { editUserPackageTaskLoading, runEditUserPackageTask };
}

export function useRequestCreateUserPackageTask(afterSuccess: (data: any) => void) {
  const { loading: createUserPackageTaskLoading, run: runCreateUserPackageTask } = useRequest(
    async (taskDetail) => {
      if (isEmpty(taskDetail)) {
        throw new Error('必须传入taskDetail');
      }
      const [res, err] = await createUserPackageTask(taskDetail);
      if (err) {
        throw err;
      }
    },
    {
      manual: true,
      onSuccess: afterSuccess,
      onError(e) {
        showErrCodeMsg('创建分群任务失败', e);
      },
    },
  );

  return { createUserPackageTaskLoading, runCreateUserPackageTask };
}

export function useRequestSavePortraitTag(afterSuccess?: any) {
  const { loading: savePortraitTagLoading, run: runSavePortraitTag } = useRequest(
    async ({ taskId, portraitTag }) => {
      const [taskDetailRes, err] = await getUserPackageTaskDetail({
        task_id: taskId,
      });
      if (!taskDetailRes || isEmpty(taskDetailRes)) {
        throw err;
      }

      const taskDetail = taskDetailRes;
      const res = await editUserPackageTask({
        task_id: taskId,
        layout: setLayoutValue(taskDetail.layout, portraitTag),
      });
      if (res) {
        return;
      }
      throw res;
    },
    {
      manual: true,
      onSuccess: afterSuccess,
      onError(e) {
        showErrCodeMsg('保存标签失败', e);
      },
    },
  );

  return { savePortraitTagLoading, runSavePortraitTag };

  function setLayoutValue(originLayoutValue: string, portraitTag: any) {
    const layout = !originLayoutValue ? {} : JSON.parse(originLayoutValue);
    layout.instanceDetailGlobalPortraitTag = portraitTag;
    return JSON.stringify(layout);
  }
}

export function useRequestGetUserPackageTaskDetail({
  taskId,
  enable = true,
  onSuccess,
  manual = false,
}: {
  taskId: number;
  enable?: boolean;
  onSuccess?: (data: any) => void;
  manual?: boolean;
}) {
  const {
    runAsync: runRequestGetUserPackageTaskDetailAsync,
    loading: getUserPackageTaskDetailLoading,
    data: userPackageTaskDetail,
  } = useRequest(
    async () => {
      if (!taskId || !enable) return Promise.resolve({});
      const [res, err] = await getUserPackageTaskDetail({
        task_id: taskId,
      });
      if (err) {
        throw err;
      }
      return res;
    },
    {
      refreshDeps: manual ? undefined : [taskId, enable],
      manual,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取分群任务详情失败', e);
      },
    },
  );

  return {
    runRequestGetUserPackageTaskDetailAsync,
    getUserPackageTaskDetailLoading,
    userPackageTaskDetail,
  };
}

export function showErrCodeMsg(customMsg: string, res: any) {
  const { msg, message: errMessage, data = {} } = res;
  const errMsg = get(data, 'detail') ? get(data, 'detail') : errMessage || msg;
  const finalErrMsg = errMsg || customMsg;
  message.error(errMsg);
  console.error(customMsg, res);
  throw finalErrMsg; // 抛出异常，这样后面的promise处理就不会走resolve分支
}

export function useRequestGetFilterOptionAvailableValue() {
  const { data: filterOptionAvailableValue, loading: filterOptionAvailableValueLoading } = useRequest(
    async () => {
      const [res, err] = await getFilterOptionAvailableValueList();
      if (res) {
        return formatForOptions(res);
      }
      throw err;
    },
    {
      cacheKey: 'opportunity_filter_option_available_value_list',
      onError(e: any) {
        showErrCodeMsg('获取筛选选项数据失败', e);
      },
    },
  );

  return { filterOptionAvailableValue, filterOptionAvailableValueLoading };

  /* 格式化为前端antd组件所需要的数据 */
  function formatForOptions(originData: any) {
    return reduce(
      originData,
      (result, tagInfo) => {
        const { id, availableValues, isRelateTag } = tagInfo;

        assign(result, {
          [id]: isRelateTag
            ? formatForRelateTag(availableValues)
            : map(availableValues, (value) => ({ label: value, value })),
        });

        return result;
      },
      {},
    );
    /* 带嵌套关系的选项 */
    function formatForRelateTag(availableValues: any) {
      return reduce(
        availableValues,
        (result, item) => {
          const [firstLevelValue, secondLevelValue] = item;
          const findResult = find(result, { value: firstLevelValue });
          if (findResult) {
            (findResult as any).children.push({
              value: secondLevelValue,
              label: secondLevelValue,
            });
          } else {
            (result as any).push({
              value: firstLevelValue,
              label: firstLevelValue,
              children: [{ value: secondLevelValue, label: secondLevelValue }],
            });
          }

          return result;
        },
        [],
      );
    }
  }
}

export function useRequestGetOpportunityList({ form, keywordSearchParams }: any) {
  const fetchFunc = useMemoizedFn(async (pageParams = {}, formData = {}) => {
    const params = {
      condition: {},
      ...buildBackendPageParams(pageParams), // 整理分页参数
      // ...buildFilterParams(keywordSearchParams),
      ...buildConditionParams(formData, keywordSearchParams),
    };
    const [res, err] = await getOpportunityList(params);
    if (err) {
      console.error(err);
    }
    if (res) {
      return {
        list: res?.data_result || [],
        total: res?.total_num ?? 0,
      };
    }
    throw err;
  });
  const {
    tableProps,
    loading: requestOpportunityListLoading,
    refresh: refreshOpportunityList,
    search,
  } = useAntdTable(fetchFunc as any, {
    form,
    manual: true,
    onError(e) {
      showErrCodeMsg('获取列表失败', e);
    },
  });

  return {
    tableProps,
    requestOpportunityListLoading,
    refreshOpportunityList,
    search,
  };

  /* 整理分页参数 */
  function buildBackendPageParams(frontendPageParams: { current: number; pageSize: number }) {
    const { current, pageSize } = frontendPageParams;
    return { page_index: current, page_size: pageSize };
  }

  /* 整理标签类筛选条件以外的筛选参数(filter) */
  // function buildFilterParams(formData) {
  //   const { keywordSearchType, keywordSearchValue } = formData || {}
  //   if (!includes(['uin', 'job'], keywordSearchType) || !keywordSearchValue)
  //     return {}
  //   return { filter: { type: keywordSearchType, value: keywordSearchValue } }
  // }

  /* 整理标签类筛选条件参数(condition) */
  function buildConditionParams(formData: any, keywordSearchParams: IKeywordSearchParams) {
    const conditionItems = [] as ICondition[];
    /* 整理关键词模糊搜索的标签 */
    buildConditionItemForKeywordSearch(keywordSearchParams, conditionItems);

    /* 处理两层联动的标签 */
    forEach(relatTagList, (field) => {
      buildConditionItemForRelateTag(formData, field, conditionItems);
    });

    /* 处理多选选项的表单组件的筛选条件 */
    buildConditionItemsForMultipleSelect(
      [...formFieldsRenderedAsCheckboxGroup, ...formFieldsRenderedAsSelect],
      formData,
      conditionItems as any,
    );

    /* 处理Select表单组件控制的筛选条件 */
    // buildConditionItemsForSelectTag(
    //   formFieldsRenderedAsSelect,
    //   formData,
    //   conditionItems,
    // )

    /* 处理“成立日期”标签，重点是处理“不限”选项和“自定义”选项 */
    buildStartDateConditionItem(formData, conditionItems);

    /* 处理“标签式”的筛选条件，特点是只有“不筛选”和值为“是”的这两种情况 */
    buildConditionItemsForOneCheckboxGroup(formData, conditionItems as any);

    // 处理企业名称模糊查询,目前只支持name类型
    const conditionParams = {} as any;
    if (isEmpty(conditionItems)) {
      conditionParams.condition = {};
    } else {
      conditionParams.condition = {
        logic: 'AND',
        items: conditionItems,
      };
    }
    buildDimConditionItemForKeywordSearch(keywordSearchParams, conditionParams);

    return conditionParams;

    /**
     * 处理“模糊查询”name类型
     * @param {*} keywordSearchParams
     * @param {*} conditionParams
     */
    function buildDimConditionItemForKeywordSearch(keywordSearchParams: IKeywordSearchParams, conditionParams: any) {
      if (get(keywordSearchParams, 'keywordSearchType') === 'name') {
        conditionParams.filter = {
          type: 'company',
          value: get(keywordSearchParams, 'keywordSearchValue'),
        };
      }
    }

    /**
     * 处理“成立日期”标签，重点是处理“不限”选项和“自定义”选项
     * @param {*} formData
     * @param {*} conditionItems
     */
    function buildStartDateConditionItem(formData: any, conditionItems: ICondition[]) {
      const startDayLevelValueList = formData.start_day_level;
      const startDateValue = formData.start_date;
      if (isEmpty(startDayLevelValueList)) {
        return;
      }

      const normalStartDayLevelValueList = filter(
        startDayLevelValueList,
        (startDayLevelValue) => startDayLevelValue !== customOptionValue,
      );
      const hasCustomOptionValue = includes(startDayLevelValueList, customOptionValue) && !isEmpty(startDateValue);
      const normalStartDayLevelConditionItem = isEmpty(normalStartDayLevelValueList)
        ? null
        : {
            ...fillTargetTagInfo('start_day_level'),
            op: '=',
            value: normalStartDayLevelValueList,
          };
      const customOptionConditionItem = hasCustomOptionValue
        ? {
            ...fillTargetTagInfo('start_date'),
            op: 'BETWEEN',
            value: [startDateValue[0].format('YYYY-MM-DD'), startDateValue[1].format('YYYY-MM-DD')],
          }
        : null;

      if (!isEmpty(normalStartDayLevelValueList) && hasCustomOptionValue) {
        conditionItems.push({
          logic: 'OR',
          items: [normalStartDayLevelConditionItem as IConditionItems, customOptionConditionItem as IConditionItems],
        });
      } else if (!isEmpty(normalStartDayLevelValueList)) {
        conditionItems.push(normalStartDayLevelConditionItem as ICondition);
      } else if (hasCustomOptionValue) {
        conditionItems.push(customOptionConditionItem as ICondition);
      }
    }

    function buildConditionItemsForOneCheckboxGroup(formData: any[], conditionItems: IConditionItems[]) {
      forEach(formData?.[formFieldNameForOneCheckboxGroup as any], (fieldName) => {
        conditionItems.push({
          ...fillTargetTagInfo(fieldName),
          op: '=',
          value: ['是'],
        });
      });
    }

    /**
     * 处理Select表单组件控制的筛选条件
     * @param {string[]} formFieldsRenderedAsSelect
     * @param {Object} formData
     * @param {Array} conditionItems
     */
    // function buildConditionItemsForSelectTag(
    //   formFieldsRenderedAsSelect,
    //   formData,
    //   conditionItems,
    // ) {
    //   forEach(formFieldsRenderedAsSelect, (fieldName) => {
    //     if (formData[fieldName]) {
    //       return
    //     }
    //     conditionItems.push({
    //       ...fillTargetTagInfo(fieldName),
    //       op: '=',
    //       value: [formData[fieldName]],
    //     })
    //   })
    // }

    /**
     * @param {string[]} formFieldsNameList
     * @param {Object} formData
     * @param {Array} conditionItems
     */
    function buildConditionItemsForMultipleSelect(
      formFieldsNameList: any,
      formData: any,
      conditionItems: IConditionItems[],
    ) {
      forEach(formFieldsNameList, (fieldName) => {
        if (isEmpty(formData[fieldName])) {
          return;
        }
        conditionItems.push({
          ...fillTargetTagInfo(fieldName),
          op: '=',
          value: formData[fieldName],
        });
      });
    }

    /**
     * 处理两层联动的标签
     * @param {Object} formData
     * @param {Object} field
     * @param {Array} conditionItems
     * @returns
     */
    function buildConditionItemForRelateTag(formData: any, field: IField, conditionItems: ICondition[]) {
      const { formFieldName, firstLevelFieldName, secondLevelFieldName } = field;
      if (isEmpty(formData[formFieldName])) {
        return;
      }
      const formFieldValue = formData[formFieldName];
      const firstLevelValueList = formFieldValue
        .filter((item: Array<string>) => item.length === 1)
        .map((item: Array<string>) => item[0]);
      const secondLevelValueList = formFieldValue
        .filter((item: Array<string>) => item.length === 2)
        .map((item: Array<string>) => item[1]);

      const conditionItem = {
        logic: 'OR',
        items: compact([
          isEmpty(firstLevelValueList)
            ? null
            : {
                ...fillTargetTagInfo(firstLevelFieldName),
                op: '=',
                value: firstLevelValueList,
              },
          isEmpty(secondLevelValueList)
            ? null
            : {
                ...fillTargetTagInfo(secondLevelFieldName),
                op: '=',
                value: secondLevelValueList,
              },
        ]),
      };
      conditionItems.push(conditionItem);
    }

    /**
     * 整理关键词模糊搜索的标签
     * @param {*} keywordSearchParams
     * @param {*} conditionItems
     * @returns
     */
    function buildConditionItemForKeywordSearch(
      keywordSearchParams: IKeywordSearchParams,
      conditionItems: ICondition[],
    ) {
      const { keywordSearchType, keywordSearchValue } = keywordSearchParams || {};
      if (!includes(['scope', 'industry', 'address', 'uin', 'job'], keywordSearchType) || !keywordSearchValue) {
        return;
      }
      switch (keywordSearchType) {
        case 'industry': {
          /* 处理“行业”，注意涉及一级行业(first_industry)和二级行业(second_industry)两个标签 */
          const firstIndustryTagconditionItem = {
            ...fillTargetTagInfo('first_industry'),
            op: 'IN',
            value: [keywordSearchValue],
          };
          const secondIndustryTagconditionItem = {
            ...fillTargetTagInfo('second_industry'),
            op: 'IN',
            value: [keywordSearchValue],
          };
          conditionItems.push({
            logic: 'OR',
            items: [firstIndustryTagconditionItem as any, secondIndustryTagconditionItem],
          });
          break;
        }
        case 'uin': {
          /* 处理uin，需要精确匹配 */
          const conditionItem = {
            ...fillTargetTagInfo(keywordSearchType),
            op: '=',
            value: [keywordSearchValue],
          };
          conditionItems.push(conditionItem as any);
          break;
        }
        default: {
          const conditionItem = {
            ...fillTargetTagInfo(keywordSearchType),
            op: 'IN',
            value: [keywordSearchValue],
          };
          conditionItems.push(conditionItem as any);
        }
      }
    }
  }
}

function fillTargetTagInfo(targetFieldName: string) {
  return pick(findTargetTag(targetFieldName), ['id', 'field_name', 'field_type']);
}

function findTargetTag(targetFieldName: string) {
  return find(tagMeta, { field_name: targetFieldName });
}

export const tagMeta = [
  {
    id: 1,
    field_name: 'name',
    field_cn_name: '企业名称',
    field_type: 'STRING',
  },
  {
    id: 2,
    field_name: 'province',
    field_cn_name: '所在地区（省份）',
    field_type: 'STRING',
  },
  {
    id: 3,
    field_name: 'city',
    field_cn_name: '所在地区（城市）',
    field_type: 'STRING',
  },
  {
    id: 4,
    field_name: 'status',
    field_cn_name: '营业状态',
    field_type: 'STRING',
  },
  {
    id: 5,
    field_name: 'econ_kind',
    field_cn_name: '企业类型',
    field_type: 'STRING',
  },
  {
    id: 6,
    field_name: 'start_date',
    field_cn_name: '成立日期',
    field_type: 'DATE',
  },
  {
    id: 7,
    field_name: 'start_day_level',
    field_cn_name: '成立年份',
    field_type: 'STRING',
  },
  {
    id: 8,
    field_name: 'regist_capi_level',
    field_cn_name: '注册资本',
    field_type: 'STRING',
  },
  {
    id: 9,
    field_name: 'collegues_num_level',
    field_cn_name: '参保人数',
    field_type: 'STRING',
  },
  {
    id: 10,
    field_name: 'isp',
    field_cn_name: '上云情况',
    field_type: 'STRING',
  },
  {
    id: 11,
    field_name: 'first_industry',
    field_cn_name: '一级行业（所属行业）',
    field_type: 'STRING',
  },
  {
    id: 12,
    field_name: 'second_industry',
    field_cn_name: '二级行业（所属行业）',
    field_type: 'STRING',
  },
  {
    id: 13,
    field_name: 'ipo',
    field_cn_name: '上市状态',
    field_type: 'STRING',
  },
  {
    id: 14,
    field_name: 'is_recent_3_month_job',
    field_cn_name: '有招聘记录（近三个月有招聘）',
    field_type: 'STRING',
  },
  {
    id: 15,
    field_name: 'is_recent_6_month_job',
    field_cn_name: '有招聘记录', // 有招聘记录（近六个月有招聘）
    field_type: 'STRING',
  },
  {
    id: 16,
    field_name: 'round',
    field_cn_name: '融资信息',
    field_type: 'STRING',
  },
  {
    id: 17,
    field_name: 'is_patents',
    field_cn_name: '有专利',
    field_type: 'STRING',
  },
  {
    id: 18,
    field_name: 'is_trademark',
    field_cn_name: '有商标',
    field_type: 'STRING',
  },
  {
    id: 19,
    field_name: 'is_copyrights',
    field_cn_name: '有软件著作权',
    field_type: 'STRING',
  },
  {
    id: 20,
    field_name: 'is_bidding',
    field_cn_name: '有招投标',
    field_type: 'STRING',
  },
  {
    id: 21,
    field_name: 'domain_cnt_level',
    field_cn_name: '有网站域名',
    field_type: 'STRING',
  },
  {
    id: 22,
    field_name: 'scope',
    field_cn_name: '经营范围',
    field_type: 'STRING',
  },
  {
    id: 23,
    field_name: 'address',
    field_cn_name: '地址',
    field_type: 'STRING',
  },
  {
    id: 24,
    field_name: 'is_domain_req_count',
    field_cn_name: '有域名热度',
    field_type: 'STRING',
  },
  {
    id: 26,
    field_name: 'domain_whois_cnt_level',
    field_cn_name: '域名whois个数',
    field_type: 'STRING',
  },
  {
    id: 27,
    field_name: 'is_high_tech',
    field_cn_name: '是专精特新企业',
    field_type: 'STRING',
  },
  {
    id: 28,
    field_name: 'app_cnt_level',
    field_cn_name: '企业APP的个数',
    field_type: 'STRING',
  },
  {
    id: 29,
    field_name: 'hash_pub_account',
    field_cn_name: '有公众号',
    field_type: 'STRING',
  },
  {
    id: 30,
    field_name: 'uin',
    field_cn_name: '腾讯云账户UIN',
    field_type: 'STRING',
  },
  {
    id: 31,
    field_name: 'job',
    field_cn_name: '招聘职位',
    field_type: 'STRING',
  },
  {
    id: 1001,
    field_name: 'app_category',
    field_cn_name: '企业APP类型',
    field_type: 'STRING',
  },
  {
    id: 1002,
    field_name: 'sdk_category',
    field_cn_name: '企业SDK类型',
    field_type: 'STRING',
  },
  {
    id: 1003,
    field_name: 'sdk_num_level',
    field_cn_name: '企业SDK个数',
    field_type: 'STRING',
  },
];
