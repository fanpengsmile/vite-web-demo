import React, { useEffect, useState } from 'react';
import { Cascader, Spin, message } from 'antd';
import { useMemoizedFn, useRequest, useSafeState, useGetState } from 'ahooks';
import { showErrCodeMsg } from '../../../base/cgi';
import {
  getUserPackageTaskInstanceList,
  getUserPackageTaskList as fetchUserPackageTaskList,
} from 'services/enterprise';
import {
  get,
  includes,
  isEmpty,
  cloneDeep,
  uniq,
  xorWith,
  find,
  isArray,
  forEach,
  findIndex,
  map,
  reduce,
} from 'lodash';
import moment from 'moment';

export function UserPackageInstanceSelect({
  value,
  onChange,
  options,
  optionsLoading,
  disabled,
  multiple = false,
  onLoadInstance,
  placeholder = '请选择分群用户包',
  style,
  loadTargetTaskOptions,
}: any) {
  const [searchValue, setSearchValue] = useState('');
  return (
    <div style={style}>
      <Spin spinning={!!optionsLoading}>
        <Cascader
          notFoundContent='没有可用的分群用户包'
          placeholder={placeholder}
          expandTrigger='click'
          allowClear
          options={options}
          disabled={disabled}
          onChange={onChange}
          loadData={onLoadInstance}
          searchValue={searchValue}
          onSearch={(v) => {
            setSearchValue(v);
          }}
          value={value}
          showSearch={{
            render: (inputValue, pathValue) => {
              let path = [];
              const { isLeaf, children = [], _taskId: taskId, label } = get(pathValue, '0', {}) as any;
              if (!isLeaf && children.length > 0) {
                delete pathValue[0].children;
                delete pathValue[0].loading;
                path.push(pathValue[0]);
              } else {
                path = pathValue || {};
              }
              return (
                <div
                  onClick={() => {
                    if (isLeaf) {
                      setSearchValue('');
                      return;
                    }
                    loadTargetTaskOptions([taskId]);
                    setSearchValue('');
                  }}
                  style={{ width: '100%' }}
                >
                  <span>{label}</span>
                </div>
              );
            },
          }}
          multiple={multiple}
          displayRender={(label) => label.join('/')}
        />
      </Spin>
    </div>
  );
}
UserPackageInstanceSelect.displayName = 'UserPackageInstanceSelect';

export function useUserPackageInstanceSelect({
  enableOptionsLoading,
  taskIdListWhichNeedPreloadInstanceList,
  taskInstanceCache,
  setTaskInstanceCache,
  disabled,
  dataType,
  ...stateForUserPackageInstanceSelect
}: any) {
  const {
    options,
    optionsLoading,
    setOptionLoading,
    loadTargetTaskOptions,
    getAlreadyLoadTaskIdList,
    getUserPackageTaskList,
    // eslint-disable-next-line no-use-before-define
  } = useOptions({
    enableOptionsLoading,
    taskIdListWhichNeedPreloadInstanceList,
    taskInstanceCache,
    setTaskInstanceCache,
    disabled,
    dataType,
  });

  const onLoadInstance = useMemoizedFn(async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const { _taskId: taskId } = targetOption;
    const alreadyLoadTaskIdList = getAlreadyLoadTaskIdList();
    if (includes(alreadyLoadTaskIdList, taskId)) {
      return;
    }
    setOptionLoading(taskId);
    loadTargetTaskOptions([taskId]);
  });

  useEffect(() => {
    getUserPackageTaskList();
  }, [dataType]);

  return {
    options,
    optionsLoading,
    onLoadInstance,
    loadTargetTaskOptions,
    setOptionLoading,
    ...stateForUserPackageInstanceSelect,
  };
}

/* https://opc-mock.woa.com/project/553/interface/api/5020 */
function useOptions({
  enableOptionsLoading,
  taskIdListWhichNeedPreloadInstanceList,
  taskInstanceCache,
  setTaskInstanceCache,
  disabled,
  dataType,
}: any) {
  const [options, setOptions] = useSafeState([]);
  const [
    // eslint-disable-next-line no-unused-vars
    alreadyLoadTaskIdList,
    setAlreadyLoadTaskIdList,
    getAlreadyLoadTaskIdList,
  ] = useGetState([]);
  const { run: runRequestGetInstanceOptions } = useRequest(
    async (taskIdList) => {
      if (isEmpty(taskIdList)) return [];
      const [res, err] = await getUserPackageTaskInstanceList({
        task_id_list: taskIdList,
        page_index: 1,
        page_size: 500,
      });
      if (err) {
        message.error(err.message);
        // eslint-disable-next-line consistent-return
        return;
      }
      if (res) {
        if (!disabled) {
          const newTaskInstanceCache = cloneDeep(taskInstanceCache);
          newTaskInstanceCache[taskIdList[0]] = res;
          setTaskInstanceCache(newTaskInstanceCache);
        }
        setAlreadyLoadTaskIdList(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uniq([...taskIdList, ...getAlreadyLoadTaskIdList()]),
        );
        return res?.pkg_task_inst_list;
      }
      throw res;
    },
    {
      manual: true,
      onSuccess(instanceList) {
        setOptions((currentOptions) => {
          const currentTaskId = getAlreadyLoadTaskIdList();
          const clonedOptions = cloneDeep(currentOptions);
          const newInstanceList = [];
          const haveInstance = [];
          for (let i = 0; i < instanceList.length; i++) {
            const taskId = instanceList[i].task_id;
            if (haveInstance.indexOf(taskId) < 0) {
              haveInstance.push(taskId);
            }
            let concat = false;
            for (let j = 0; j < newInstanceList.length; j++) {
              if (newInstanceList[j][0].task_id === taskId) {
                newInstanceList[j].push(instanceList[i]);
                concat = true;
                break;
              }
            }
            if (!concat) {
              newInstanceList.push([instanceList[i]]);
            }
          }
          // 没有实例的情况
          const noInstance = xorWith(currentTaskId, haveInstance);
          for (let i = 0; i < noInstance.length; i++) {
            const targetOption = find(clonedOptions, { _taskId: noInstance[i] }) || {};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!isArray(targetOption.children)) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              targetOption.children = [
                {
                  value: `relative-time`,
                  label: '相对时间',
                  isLeaf: false,
                  children: [
                    {
                      // eslint-disable-next-line no-template-curly-in-string
                      value: '${today}',
                      label: '当天',
                      isLeaf: true,
                    },
                    {
                      // eslint-disable-next-line no-template-curly-in-string
                      value: '${unlimited_time}',
                      label: '时间不限',
                      isLeaf: true,
                    },
                  ],
                },
              ];
            }
          }
          for (let i = 0; i < newInstanceList.length; i++) {
            const taskId = get(newInstanceList[i][0], 'task_id');
            const targetOption = find(clonedOptions, { _taskId: taskId }) || {};
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!isArray(targetOption.children)) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              targetOption.children = [
                {
                  value: `absolute-time`,
                  label: '绝对时间',
                  isLeaf: false,
                  children: [],
                },
                {
                  value: `relative-time`,
                  label: '相对时间',
                  isLeaf: false,
                  children: [
                    {
                      // eslint-disable-next-line no-template-curly-in-string
                      value: '${today}',
                      label: '当天',
                      isLeaf: true,
                    },
                    {
                      // eslint-disable-next-line no-template-curly-in-string
                      value: '${unlimited_time}',
                      label: '时间不限',
                      isLeaf: true,
                    },
                  ],
                },
              ];
            }

            forEach(newInstanceList[i], (instance) => {
              const { task_id: taskId, inst_id: instanceId, start_time: startTime, ftime } = instance;
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              targetOption.loading = false;
              if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                findIndex(targetOption.children[0].children, {
                  _instanceId: instanceId,
                }) === -1
              ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                targetOption.children[0].children.push({
                  value: `instance-${instanceId}:${ftime}`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  label: moment(startTime).format('YYYY-MM-DD'),
                  isLeaf: true,
                  _taskId: taskId,
                  _instanceId: instanceId,
                });
              }
            });
          }
          return clonedOptions;
        });
      },
      onError(e) {
        showErrCodeMsg('获取分群实例列表失败', e);
      },
    },
  );

  const loadTargetTaskOptions = (taskIdList: any) => {
    runRequestGetInstanceOptions(taskIdList);
  };

  const { loading: optionsLoading, run: getUserPackageTaskList } = useRequest(
    async () => {
      if (!enableOptionsLoading) return [];
      const [res, err] = await fetchUserPackageTaskList({
        page_index: 1,
        page_size: 2000,
        data_type: dataType,
      });
      if (err) {
        message.error(err.message);
        // eslint-disable-next-line consistent-return
        return;
      }
      if (res) {
        return res.pkg_task_list;
      }
      throw res;
    },
    {
      refreshDeps: [enableOptionsLoading],
      onSuccess(pkgTaskList) {
        const filterpPkgTaskList = pkgTaskList.filter(
          (item: any) => get(item, 'status') === 'done' || get(item, 'status') === 'running',
        );
        setOptions(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map(filterpPkgTaskList, (task) => {
            const { task_id: taskId, task_name: taskName, period_type: periodType, disabled } = task;
            return {
              value: `task-${taskId}`,
              label: `${taskName}(${taskId})`,
              isLeaf: periodType === 'once',
              _taskId: taskId,
              disabled,
            };
          }),
        );
        if (!isEmpty(taskIdListWhichNeedPreloadInstanceList) && !isEmpty(filterpPkgTaskList)) {
          loadTargetTaskOptions(taskIdListWhichNeedPreloadInstanceList);
        }
      },
      onError(e) {
        showErrCodeMsg('获取分群任务列表失败', e);
      },
    },
  );

  const setOptionLoading = (taskId: number) => {
    setOptions((currentOptions) => {
      const targetOption = find(currentOptions, { _taskId: taskId }) || {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      targetOption.loading = true;
      return currentOptions;
    });
  };

  return {
    options,
    optionsLoading,
    setOptionLoading,
    loadTargetTaskOptions,
    getAlreadyLoadTaskIdList,
    alreadyLoadTaskIdList,
    getUserPackageTaskList,
  };
}

// eslint-disable-next-line consistent-return
export async function getTaskInstanceMap(taskIdList: any) {
  try {
    const [res, err] = await getUserPackageTaskInstanceList({
      task_id_list: taskIdList,
      page_index: 1,
      page_size: 500,
    });
    if (err) {
      throw res;
    }
    const instanceList = res?.pkg_task_inst_list;

    return reduce(
      instanceList,
      (result: any, instance) => {
        const { inst_id: instanceId, task_id: taskId } = instance;
        if (!result[taskId]) {
          result[taskId] = [instanceId];
        } else {
          result[taskId].push(instanceId);
        }

        return result;
      },
      {},
    );
  } catch (e) {
    showErrCodeMsg('获取分群实例列表失败', e);
  }
}
