import React, { useState, useEffect } from 'react';
import { Form, Space, message, Spin } from 'antd';
import BasicInfo from './BasicInfo';
import GroupSelect from './GroupSelect';
import { CustomArea } from './CustomArea';
import { GroupChart } from './GroupChart';
import {
  conditionInsight,
  getInsightTaskList,
  editInsightTask,
  createInsightTask,
  getUserPackageTaskInstanceList,
} from 'services/enterprise';
import { showErrCodeMsg } from '../../../base/cgi';
import { get, cloneDeep, find } from 'lodash';
import { column } from '../../config';
import { useNavigate } from 'react-router-dom';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function useCreate(mode: string, taskId: number) {
  const [form] = Form.useForm();
  const [fieldsValue, setFieldsValue] = useState({});
  const [tagMetaList, setTagMetaList] = useState([]);
  const [detailData, setDeatilData] = useState();
  const [loading, setLoading] = useState(false);
  const [columns, setColums] = useState(column);
  const [aimPkgInstId, setAimPkgInstId] = useState(0);
  const [pkgInstId, setPkgInstId] = useState(0);
  const [saveData, setSaveData] = useState<any>({});
  const isDetail = mode === 'detail';
  let layout = {};
  if (detailData) {
    try {
      layout = JSON.parse(get(detailData, 'layout'));
    } catch (error) {
      // eslint-disable-next-line no-unused-expressions
      detailData || message.error('保存报告数据有误');
    }
  }
  const fetchChartData = async (tags: any, showTgi: boolean, filterCondition: any, clearChartTags: any) => {
    const clearChartTagsDom = document.getElementById('clearChartTags');
    if (clearChartTagsDom && clearChartTags) {
      clearChartTagsDom.click();
    }
    if (filterCondition) {
      // eslint-disable-next-line no-param-reassign
      tags = saveData.tags;
      // eslint-disable-next-line no-param-reassign
      showTgi = saveData.showTgi;
    } else {
      setSaveData({
        tags,
        showTgi,
      });
      const columsCopy = cloneDeep(columns);
      for (let t = 0; t < tags.length; t++) {
        columsCopy.push({
          title: get(tags[t], 'dirName'),
          dataIndex: get(tags[t], 'relateTag'),
          width: 100,
        });
      }
      setColums(columsCopy);
    }
    if (!tags || tags.length === 0) return;
    setLoading(true);
    const customPkgId = aimPkgInstId || get(layout, 'aimPkgInstId');
    const param = {
      pkg_inst_id: customPkgId,
      is_tgi: showTgi ? 1 : 0,
      insight_result_show: [],
    } as any;
    const ret = [];
    const pkgId = pkgInstId || get(layout, 'pkgInstId');
    for (let i = 0; i < tags.length; i++) {
      const currentTag = find(tagMetaList, {
        fieldName: tags[i].relateTag.split('|')[0],
      });
      if (!get(currentTag, 'tag_id')) {
        // eslint-disable-next-line no-continue
        continue;
      }
      let irs = {} as any;
      tags[i].field_type = get(currentTag, 'field_type');
      tags[i].tag_id = get(currentTag, 'tag_id');
      irs = {
        tag_id: get(currentTag, 'tag_id'),
        is_default: 1,
      };
      if (get(currentTag, 'field_type') === 'STRING') {
        irs.order_field = 'TAG_RESULT';
        irs.order_type = 'ASC';
      }
      param.insight_result_show = [irs];
      if (filterCondition) {
        param.filter_condition = {
          logic: 'AND',
          items: filterCondition,
        };
      }
      // eslint-disable-next-line no-await-in-loop
      const [res, err] = await conditionInsight(param);
      if (err) {
        message.error(err.message);
        return;
      }
      let resRet = get(res, 'ret.0', {}) as any;
      resRet.field_type = tags[i].field_type;
      resRet.is_tgi = showTgi ? 1 : 0;
      resRet.pkgId = customPkgId;
      ret.push(resRet);
      if (pkgId) {
        param.pkg_inst_id = pkgId;
        delete param.task_id;
        // eslint-disable-next-line no-await-in-loop
        const [contrastRes] = await conditionInsight(param);
        resRet = get(contrastRes, 'ret.0', {});
        resRet.field_type = tags[i].field_type;
        resRet.is_tgi = showTgi ? 1 : 0;
        resRet.is_contrast = true;
        resRet.pkgId = pkgId;
        ret.push(resRet);
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line no-use-before-define
    setChartData(ret);
    setLoading(false);
  };
  // const [contrastChartData, setContrastChartData] = useState([])
  const [chartData, setChartData] = useState([]);
  const fetchDetailData = async () => {
    const params = {
      page_index: 1,
      page_size: 1,
      task_id_list: [taskId],
    };
    const [res, err] = await getInsightTaskList(params);
    if (err) {
      message.error(err.message);
      return;
    }
    setDeatilData(get(res, 'insight_task_list.0'));
  };
  useEffect(() => {
    if (taskId) {
      fetchDetailData();
    }
  }, [tagMetaList]);
  return {
    form,
    setFieldsValue,
    fieldsValue,
    isDetail,
    detailData,
    fetchChartData,
    tagMetaList,
    setTagMetaList,
    chartData,
    loading,
    setChartData,
    pkgInstId,
    saveData,
    setAimPkgInstId,
    setPkgInstId,
    aimPkgInstId,
    layout,
    columns,
  };
}

export function ClusterInsightCreate({ mode, taskId, staffname }: any) {
  const {
    form,
    setFieldsValue,
    fieldsValue,
    isDetail,
    detailData,
    fetchChartData,
    tagMetaList,
    setTagMetaList,
    chartData,
    loading,
    setChartData,
    pkgInstId,
    saveData,
    setAimPkgInstId,
    setPkgInstId,
    aimPkgInstId,
    layout,
    columns,
  } = useCreate(mode, taskId);
  const navigate = useNavigate();
  const submit = async () => {
    await form.validateFields();
    const aimClusterValue = get(fieldsValue, 'aimCluster') || get(layout, 'aimCluster');
    const contrastCluster = get(fieldsValue, 'contrastCluster') || get(layout, 'contrastCluster');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const aimLabel = aimClusterValue.split(':')[1];
    let param = {
      task_name: get(fieldsValue, 'task_name') || get(detailData, 'task_name') || staffname,
      owner_list: get(fieldsValue, 'owner_list') || get(detailData, 'owner_list'),
      owner_ft: get(fieldsValue, 'ft') || get(detailData, 'owner_ft'),
      creator: get(fieldsValue, 'creator') || get(detailData, 'creator'),
      task_type: 'pkg_import',
      data_type: get(fieldsValue, 'data_type') || get(detailData, 'data_type') || 'uin',
      layout: JSON.stringify({
        aimCluster: aimClusterValue,
        aimLabel,
        contrastCluster,
        tags: get(saveData, 'tags') || get(layout, 'tags'),
        showTgi: get(saveData, 'showTgi') || get(layout, 'showTgi'),
        aimPkgInstId: aimPkgInstId || get(layout, 'aimPkgInstId'),
        pkgInstId: pkgInstId || get(layout, 'pkgInstId'),
      }),
      type_para: {
        inner_condition: {
          global_logic: 'AND',
          // eslint-disable-next-line no-use-before-define
          pkg_condition: await calcTypePara(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            fieldsValue.aimCluster ? fieldsValue : layout,
          ),
        },
      },
    } as any;
    let res;
    if (mode === 'edit' || mode === 'detail') {
      param = {
        task_id: get(detailData, 'task_id'),
        ...param,
      };
      res = (await editInsightTask(param)) as any;
    } else if (mode === 'create' || mode === 'copy') {
      res = (await createInsightTask(param)) as any;
    }
    if (res[0]) {
      // eslint-disable-next-line no-unused-expressions
      mode === 'detail' || navigate('/enterprise/cluster_insight_list');
      message.success(
        // eslint-disable-next-line no-nested-ternary
        mode === 'create' || mode === 'copy' ? '创建成功' : mode === 'edit' ? '编辑成功' : '保存报告成功',
      );
    } else {
      message.error(get(res[1], 'returnMessage', '操作失败'));
    }
  };
  const dataType = get(fieldsValue, 'data_type') || get(detailData, 'data_type') || 'uin';
  return (
    <Space direction='vertical' style={{ width: '100%' }} size={10}>
      <Form
        form={form}
        {...FORM_ITEM_LAYOUT}
        onValuesChange={(val) => {
          setFieldsValue({
            ...fieldsValue,
            ...val,
          });
        }}
        colon={false}
      >
        <BasicInfo isDetail={isDetail} form={form} staffname={staffname} detailData={detailData}></BasicInfo>
        <GroupSelect
          form={form}
          dataType={dataType}
          isDetail={isDetail}
          setAimPkgInstId={setAimPkgInstId}
          detailData={detailData}
          setPkgInstId={setPkgInstId}
        ></GroupSelect>
        <CustomArea
          fetchChartData={fetchChartData}
          dataType={dataType}
          tagMetaList={tagMetaList}
          setTagMetaList={setTagMetaList}
          detailData={detailData}
          isDetail={isDetail}
        ></CustomArea>
        <Spin spinning={loading}>
          <GroupChart
            setChartData={setChartData}
            submit={submit}
            columns={columns}
            chartData={chartData}
            fetchChartData={fetchChartData}
            taskId={taskId}
            saveData={saveData}
          ></GroupChart>
        </Spin>
      </Form>
    </Space>
  );
}
ClusterInsightCreate.displayName = 'ClusterInsightCreate';

const calcTypePara = async (formFieldsValue: any) => {
  const { aimCluster } = formFieldsValue;
  const onlyTaskIdList = parseInt(aimCluster.split('-')[1], 10);
  // const taskInstanceMap = isEmpty(onlyTaskIdList)
  //   ? {}
  //   : await getTaskInstanceMap(onlyTaskIdList)
  // eslint-disable-next-line no-use-before-define
  const taskInstanceMap = await getTaskInstanceMap([onlyTaskIdList]);
  return taskInstanceMap;
};

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

    return { base_pkg_inst_ids: instanceList.map((item: any) => item.inst_id) };
  } catch (e) {
    showErrCodeMsg('获取分群实例列表失败', e);
  }
}
