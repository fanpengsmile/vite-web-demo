/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React from 'react';
import { Card, Form } from 'antd';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import {
  UserPackageInstanceSelect,
  useUserPackageInstanceSelect,
} from '../../../Common/Components/TagInput/UserPackageInstanceSelect';
import { uniq, map, compact, concat, isEmpty, toNumber, replace, get } from 'lodash';

export function ExistedPkgForm({
  form,
  mode,
  isTaskDetailReadyWhenNeed,
  disabled,
  taskInstanceCache,
  setTaskInstanceCache,
  dataType,
}: any) {
  const existedPkgFormValue = Form.useWatch('existedPkgForm', form);
  const { basePkgInstIds, interPkgInstIds, diffPkgInstIds } = existedPkgFormValue ?? {};
  const stateForUserPackageInstanceSelect = useUserPackageInstanceSelect({
    placeholder: '请选择已创建分群包名称',
    style: { width: '50%' },
    enableOptionsLoading: mode === 'create' || isTaskDetailReadyWhenNeed,
    taskInstanceCache,
    setTaskInstanceCache,
    disabled,
    dataType,
    taskIdListWhichNeedPreloadInstanceList: uniq(
      map(compact(concat(basePkgInstIds, interPkgInstIds, diffPkgInstIds)), ([taskIdStr]) => {
        return getRealTaskId(taskIdStr);
      }),
    ),
  });

  const isBasePkgInstIdsFormItemRequired = !isEmpty(interPkgInstIds) || !isEmpty(diffPkgInstIds);

  return (
    <Card
      title={
        <>
          <span>导入分群</span>
          <ExclamationCircleTwoTone style={{ marginRight: 5, marginLeft: 10, fontSize: 14 }} />
          <span style={{ fontWeight: 'normal', fontSize: 12 }}>支持对已创建分群用户包的交、并、差计算来创建新分群</span>
        </>
      }
      className='mb15'
    >
      <Form.Item
        name={['existedPkgForm', 'basePkgInstIds']}
        label='选取目标分群，选取多个分群表示分群间是相加的关系'
        labelCol={{ span: 24 }}
        rules={[
          {
            required: isBasePkgInstIdsFormItemRequired,
            message: '目标分群不能为空',
          },
        ]}
      >
        <UserPackageInstanceSelect {...stateForUserPackageInstanceSelect} multiple disabled={disabled} />
      </Form.Item>
      <Form.Item
        name={['existedPkgForm', 'interPkgInstIds']}
        label='计算相交人群，得到与目标分群相交运算后的分群结果'
        labelCol={{ span: 24 }}
      >
        <UserPackageInstanceSelect {...stateForUserPackageInstanceSelect} multiple disabled={disabled} />
      </Form.Item>
      <Form.Item
        name={['existedPkgForm', 'diffPkgInstIds']}
        label='选择剔除分群，剔除选择的分群'
        labelCol={{ span: 24 }}
      >
        <UserPackageInstanceSelect {...stateForUserPackageInstanceSelect} multiple disabled={disabled} />
      </Form.Item>
    </Card>
  );
}

ExistedPkgForm.displayName = 'ExistedPkgForm';
ExistedPkgForm.convertFrontendFieldsValueToBackendFormat = async (formFieldsValue: any, taskInstanceCache: any) => {
  const { basePkgInstIds = [], interPkgInstIds = [], diffPkgInstIds = [] } = formFieldsValue;

  const basePkg = await calcTaskParams(basePkgInstIds, taskInstanceCache);
  const interPkg = await calcTaskParams(interPkgInstIds, taskInstanceCache);
  const diffPkg = await calcTaskParams(diffPkgInstIds, taskInstanceCache);

  return {
    base_pkg_tasks_params: basePkg,
    inter_pkg_tasks_params: interPkg,
    diff_pkg_tasks_params: diffPkg,
  };
};

function getRealTaskId(taskIdStr: string) {
  return toNumber(replace(taskIdStr, 'task-', ''));
}

async function calcTaskParams(basePkgInstIds: any, taskInstanceCache: any) {
  const base_pkg_tasks_params = [];
  for (let i = 0; i < basePkgInstIds.length; i++) {
    const baseItem = basePkgInstIds[i];
    const baseItemId = parseInt(get(baseItem, '0', '').split('-')[1], 10);
    base_pkg_tasks_params.push({
      task_id: baseItemId,
      ftimes: [],
    });
    if (baseItem.length === 1) {
      // @ts-ignore
      // eslint-disable-next-line no-template-curly-in-string
      base_pkg_tasks_params[i].ftimes.push('${unlimited_time}');
    } else if (baseItem.length === 2) {
      if (baseItem[1] === 'absolute-time') {
        const fttime = getTaskInstanceMap(baseItemId, taskInstanceCache);
        // @ts-ignore
        base_pkg_tasks_params[i].ftimes.push([...fttime]);
      } else if (baseItem[1] === 'relative-time') {
        // @ts-ignore
        // eslint-disable-next-line no-template-curly-in-string
        base_pkg_tasks_params[i].ftimes.push('${today}');
        // @ts-ignore
        // eslint-disable-next-line no-template-curly-in-string
        base_pkg_tasks_params[i].ftimes.push('${unlimited_time}');
      }
    } else if (baseItem[1] === 'absolute-time') {
      const fttime = get(baseItem, '2', '').split(':')[1];
      // @ts-ignore
      base_pkg_tasks_params[i].ftimes.push(fttime);
    } else if (baseItem[1] === 'relative-time') {
      // @ts-ignore
      base_pkg_tasks_params[i].ftimes.push(baseItem[2]);
    }
  }
  return base_pkg_tasks_params;
}

// @ts-ignore
// eslint-disable-next-line consistent-return
function getTaskInstanceMap(taskIdList, taskInstanceCache) {
  try {
    const res = taskInstanceCache[taskIdList];
    const instanceList = get(res, 'data.pkg_task_inst_list', []);
    const fttimelist = [];
    for (let i = 0; i < instanceList.length; i++) {
      const { ftime } = instanceList[i];
      fttimelist.push(ftime);
    }
    return fttimelist;
  } catch (e) {
    console.error(e);
  }
}
