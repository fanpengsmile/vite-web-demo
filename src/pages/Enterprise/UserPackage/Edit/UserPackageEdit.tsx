/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { isEmpty, delay, reduce, forEach, concat, get, some, keys, includes, every, pick } from 'lodash';
import { Form, Spin, message, Button } from 'antd';
import { useMemoizedFn, useSafeState } from 'ahooks';
import { TagParamForm } from './Component/TagParamForm';
import { BehaviorParamForm } from './Component/BehaviorParamForm';
import { BasicInfoForm } from './Component/BasicInfoForm';
import { FooterForm } from './Component/FooterForm';
import { ExistedPkgForm } from './Component/ExistedPkgForm';
import {
  useRequestGetUserPackageTaskDetail,
  useRequestCreateUserPackageTask,
  useRequestEditUserPackageTask,
} from '../../base/cgi';
import { useNavigate } from 'react-router-dom';
import {
  TagParamInputGroup,
  usePredictUserPackageSize,
  BehaviorParamInputGroup,
  tagFieldNameFieldName,
  valueFieldName,
  operatorFieldName,
} from '../../Common/Components/TagInput/index';
import { eventTrackingReport, editTemplateList, addTemplateList } from 'services/enterprise';

const formInitialValues = {
  task_name: '',
  data_type: 'uin',
  owner_list: '',
  globalLogicForTagParamForm: 'AND',
  tagParamForm: [],
  globalLogicForBehaviorParamForm: 'AND',
  behaviorParamForm: [],
  period_type: 'once',
  periodEndDate: undefined,
  task_expire_notify: false,
  extract_error_or_zero_notify: false,
  extract_out_limit_percent_check: false,
  extract_out_limit_percent: undefined,
  existedPkgForm: {
    basePkgInstIds: undefined,
    interPkgInstIds: undefined,
    diffPkgInstIds: undefined,
  },
};

const frontendBackendSameStructureFieldList = ['task_name', 'owner_list', 'data_type', 'period_type'];

export function UserPackageEdit({
  common: { panshiAuthMap },
  taskTypeFromUrl,
  route,
  match,
  id: taskId,
  mode,
  modeStr,
  fromSystem,
  isUserPackage,
  userPackageTemValue = {},
}: any) {
  const { showTemplateValue = {}, isTemplateShow, setShowTemplateDialog, templateDetail } = userPackageTemValue;
  const {
    form,
    getUserPackageTaskDetailLoading,
    handleSubmit,
    btnSubmitLoading,
    onPredictUserPackageSize,
    predictUserPackageSizeState,
    onFormFieldsValuesChange,
    clearPackageSizePredictResult,
    isAllowEditExtractCondition,
    isTaskDetailReadyWhenNeed,
    currentTaskType,
    importFieldsValue,
    importFieldsLevel,
    setImportFieldsLevel,
    setParamType,
    taskInstanceCache,
    setTaskInstanceCache,
    dataType,
    importInitValue,
    submitTemplate,
    applyTemplate,
    updateTemplate,
    setDataType,
  } = useUserPackageEdit({
    route,
    match,
    panshiAuthMap,
    taskId,
    mode,
    modeStr,
    fromSystem,
    taskTypeFromUrl,
  });
  const { userPackageTem } = showTemplateValue;

  const isExtractConditionDisabled = mode === 'edit' && !isAllowEditExtractCondition;

  const isCurrentTaskIsPkgImport = currentTaskType === 'pkg_import';
  const isdefaultHidden = isCurrentTaskIsPkgImport && mode === 'create';

  useEffect(() => {
    if (isTemplateShow && userPackageTem) {
      setDataType(showTemplateValue?.dataType);
      form.setFieldsValue({
        behaviorParamForm: BehaviorParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(
          userPackageTem.behaviorParamForm,
        ),
      });
    }
  }, [showTemplateValue]);

  return (
    <div style={{ minWidth: 1400 }}>
      <Spin spinning={!!getUserPackageTaskDetailLoading}>
        <Form form={form} initialValues={formInitialValues} onValuesChange={onFormFieldsValuesChange}>
          {isTemplateShow ? null : (
            <BasicInfoForm
              mode={mode}
              dataType={dataType}
              currentTaskType={currentTaskType}
              isUserPackage={isUserPackage}
              applyTemplate={applyTemplate}
            />
          )}
          {isCurrentTaskIsPkgImport && (
            <ExistedPkgForm
              taskInstanceCache={taskInstanceCache}
              setTaskInstanceCache={setTaskInstanceCache}
              mode={mode}
              dataType={dataType}
              isTaskDetailReadyWhenNeed={isTaskDetailReadyWhenNeed}
              disabled={isExtractConditionDisabled}
            />
          )}
          <TagParamForm
            form={form}
            dataType={dataType}
            isTemplateShow={isTemplateShow}
            userPackageTem={userPackageTem}
            setParamType={setParamType}
            setImportFieldsLevel={setImportFieldsLevel}
            importFieldsLevel={importFieldsLevel}
            importFieldsValue={importFieldsValue}
            importInitValue={importInitValue}
            disabled={templateDetail || isExtractConditionDisabled}
            clearPackageSizePredictResult={clearPackageSizePredictResult}
            defaultHidden={isdefaultHidden}
          />
          {dataType === 'company' ? null : (
            <BehaviorParamForm
              setImportFieldsLevel={setImportFieldsLevel}
              importFieldsLevel={importFieldsLevel}
              importFieldsValue={importFieldsValue}
              importInitValue={importInitValue}
              form={form}
              setParamType={setParamType}
              disabled={templateDetail || isExtractConditionDisabled}
              clearPackageSizePredictResult={clearPackageSizePredictResult}
              defaultHidden={isdefaultHidden}
            />
          )}
          {isTemplateShow ? null : (
            <FooterForm
              mode={mode}
              showTemplate={true}
              dataType={dataType}
              modeStr={modeStr}
              submitTemplate={submitTemplate}
              onSubmit={handleSubmit}
              btnSubmitLoading={btnSubmitLoading}
              onPredictUserPackageSize={onPredictUserPackageSize}
              predictUserPackageSizeState={predictUserPackageSizeState}
              showPredictUserPackageSize={!isExtractConditionDisabled}
            />
          )}
          {
            // 为更新创建标签圈选标签模板使用，与模板无关可忽略
            isTemplateShow ? (
              <div style={{ float: 'right' }}>
                <Button
                  onClick={() => {
                    setShowTemplateDialog('');
                  }}
                  style={{ marginRight: '10px' }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    updateTemplate(showTemplateValue, setShowTemplateDialog);
                  }}
                  type='primary'
                >
                  确定
                </Button>
              </div>
            ) : null
          }
        </Form>
      </Spin>
    </div>
  );
}
UserPackageEdit.displayName = 'UserPackageEdit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useUserPackageEdit({ route, match, panshiAuthMap, taskId, mode, modeStr, fromSystem, taskTypeFromUrl }: any) {
  const [currentTaskType, setCurrentTaskType] = useSafeState(taskTypeFromUrl);
  // const [dataType, setDataType] = useState('uin')
  const [taskInstanceCache, setTaskInstanceCache] = useState({});
  const isAllowEditExtractCondition = !!panshiAuthMap?.enterprisePackageManage?.availableForEditPackageExtractCondition;
  const [form] = Form.useForm();
  const [isTaskDetailReadyWhenNeed, setIsTaskDetailReadyInEditMode] = useSafeState(false);
  const { getUserPackageTaskDetailLoading } = useRequestGetUserPackageTaskDetail({
    taskId,
    enable: mode === 'edit' || mode === 'copy',
    onSuccess(backendTaskDetail) {
      if ((mode === 'edit' || mode === 'copy') && !isEmpty(backendTaskDetail)) {
        setDataType(backendTaskDetail.data_type);
        setCurrentTaskType(backendTaskDetail.task_type);
        form.setFieldsValue(convertTaskDetailToFrontendFormat(backendTaskDetail, currentTaskType));
        // 确保任务详情已经传进form里
        // @ts-ignore
        delay(() => {
          setIsTaskDetailReadyInEditMode(true);
        });
      }
    },
  });
  const { runExtractInnerCustomer, clearPackageSizePredictResult, ...restStateForPredictUserPackageSize } =
    usePredictUserPackageSize();

  const onPredictUserPackageSize = useMemoizedFn(async () => {
    const fieldsValue = form.getFieldsValue(); // 获取所有表单项的值
    const {
      tagParamForm,
      globalLogicForTagParamForm,
      behaviorParamForm,
      globalLogicForBehaviorParamForm,
      existedPkgForm,
    } = fieldsValue;
    try {
      await form.validateFields(buildFormFieldNameListForValidation(tagParamForm, behaviorParamForm)); // 校验当前表单，注意这是个异步的过程，需要使用await
    } catch (e) {
      message.warning('当前有筛选条件未配置，请检查该条件后重新提交');
      return;
    }

    const extraValidateResult = extraValidateForExtractParams(fieldsValue, currentTaskType);
    if (!extraValidateResult) {
      return;
    }

    const innerCondition = await buildCondition({
      currentTaskType,
      tagParamForm,
      globalLogicForTagParamForm,
      behaviorParamForm,
      globalLogicForBehaviorParamForm,
      existedPkgForm,
    });
    runExtractInnerCustomer(innerCondition);

    function buildFormFieldNameListForValidation(tagParamForm: any, behaviorParamForm: any) {
      const tagParamFormFieldNameList = reduce(
        tagParamForm,
        (result, { children }, index) => {
          const requiredFormItemFieldNameList = [tagFieldNameFieldName, valueFieldName, operatorFieldName];
          const formItemNamePathPrefix = ['tagParamForm', index];

          if (isEmpty(children)) {
            forEach(requiredFormItemFieldNameList, (requiredFormItemFieldName) => {
              // @ts-ignore
              result.push([...formItemNamePathPrefix, requiredFormItemFieldName]);
            });
          } else {
            forEach(children, (child, childIndex) => {
              const childFormItemNamePathPrefix = [...formItemNamePathPrefix, 'children'];
              forEach(requiredFormItemFieldNameList, (requiredFormItemFieldName) => {
                // @ts-ignore
                result.push([...childFormItemNamePathPrefix, childIndex, requiredFormItemFieldName]);
              });
            });
          }

          return result;
        },
        [],
      );

      const behaviorParamFormFieldNameList = reduce(
        behaviorParamForm,
        (formFieldNameList, { eventPropertyParams }, behaviorParamIndex) => {
          // @ts-ignore
          formFieldNameList.push(['behaviorParamForm', behaviorParamIndex, 'event']);
          forEach(eventPropertyParams, (eventPropertyParam, eventPropertyParamIndex) => {
            // @ts-ignore
            formFieldNameList.push([
              'behaviorParamForm',
              behaviorParamIndex,
              'eventPropertyParams',
              eventPropertyParamIndex,
              'tagFieldName',
            ]);
            // @ts-ignore
            formFieldNameList.push([
              'behaviorParamForm',
              behaviorParamIndex,
              'eventPropertyParams',
              eventPropertyParamIndex,
              'value',
            ]);
            // @ts-ignore
            formFieldNameList.push([
              'behaviorParamForm',
              behaviorParamIndex,
              'eventPropertyParams',
              eventPropertyParamIndex,
              'dateRangeParamValue',
            ]);
          });

          return formFieldNameList;
        },
        [],
      );

      return concat(tagParamFormFieldNameList, behaviorParamFormFieldNameList);
    }
  });

  const [importFieldsLevel, setImportFieldsLevel] = useState([]);
  const [paramType, setParamType] = useState('');
  const [dataType, setDataType] = useState('uin');
  const navigate = useNavigate();

  // eslint-disable-next-line consistent-return
  const importInitValue = () => {
    if (paramType === 'tag') {
      const tagParamValue = form.getFieldValue('tagParamForm');
      if (importFieldsLevel.length === 1) {
        const flagValue = get(tagParamValue, `${get(importFieldsLevel, '0')}.value`);
        return [...(flagValue || [])];
      }
      const flagValue = get(
        // eslint-disable-next-line prettier/prettier
          tagParamValue, `${importFieldsLevel[0]}.children.${importFieldsLevel[1]}.value`
      );
      return [...(flagValue || [])];
    }
    if (paramType === 'behavior') {
      const behaviorParamValue = form.getFieldValue('behaviorParamForm');
      const flagValue =
        behaviorParamValue[get(importFieldsLevel, '0')].eventPropertyParams[get(importFieldsLevel, '1')].value;
      return [...(flagValue || [])];
    }
  };

  const importFieldsValue = (value: any) => {
    if (paramType === 'tag') {
      const tagParamValue = form.getFieldValue('tagParamForm');
      if (importFieldsLevel.length === 1) {
        const newValue = [];
        for (let i = 0; i < value.length; i++) {
          if (newValue.indexOf(value[i]) < 0) {
            newValue.push(value[i]);
          }
        }
        tagParamValue[`${get(importFieldsLevel, '0')}`].value = newValue;
        form.setFieldValue('tagParamForm', tagParamValue);
      } else {
        const newValue = [];
        for (let i = 0; i < value.length; i++) {
          if (newValue.indexOf(value[i]) < 0) {
            newValue.push(value[i]);
          }
        }
        tagParamValue[`${get(importFieldsLevel, '0')}`].children[`${get(importFieldsLevel, '1')}`].value = newValue;
        form.setFieldValue('tagParamForm', tagParamValue);
      }
    } else if (paramType === 'behavior') {
      const behaviorParamValue = form.getFieldValue('behaviorParamForm');
      const newValue = [];
      for (let i = 0; i < value.length; i++) {
        if (newValue.indexOf(value[i]) < 0) {
          newValue.push(value[i]);
        }
      }
      behaviorParamValue[importFieldsLevel[0]].eventPropertyParams[importFieldsLevel[1]].value = newValue;
      form.setFieldValue('behaviorParamForm', behaviorParamValue);
    }
  };

  const onFormFieldsValuesChange = useMemoizedFn((changedValues) => {
    if (
      some(keys(changedValues), (changedFieldKey) =>
        includes(
          [
            'globalLogicForTagParamForm',
            'tagParamForm',
            'globalLogicForBehaviorParamForm',
            'behaviorParamForm',
            'existedPkgForm',
          ],
          changedFieldKey,
        ),
      )
    ) {
      clearPackageSizePredictResult();
    }
    if (changedValues.data_type) {
      setDataType(changedValues.data_type);
      form.setFieldValue('tagParamForm', undefined);
    }
  });

  const afterSuccessCreateOrEdit = () => {
    message.success(`已${modeStr}分群`);
    delay(() => {
      navigate(`/enterprise/user_package_list/list`);
    }, 1000);
  };

  const { createUserPackageTaskLoading, runCreateUserPackageTask } =
    useRequestCreateUserPackageTask(afterSuccessCreateOrEdit);
  const { editUserPackageTaskLoading, runEditUserPackageTask } =
    useRequestEditUserPackageTask(afterSuccessCreateOrEdit);

  const applyTemplate = (layoutJsonObj: any) => {
    form.setFieldsValue({
      tagParamForm: TagParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(layoutJsonObj.tagParamForm),
      behaviorParamForm: BehaviorParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(
        layoutJsonObj.behaviorParamForm,
      ),
    });
  };
  const updateTemplate = async (templateValue: any, setShowEditTemplateDialog: any) => {
    const fieldsValue = form.getFieldsValue();
    const { tagParamForm, behaviorParamForm } = fieldsValue;
    const tagParam = TagParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(tagParamForm);
    const behaviorParam = BehaviorParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(behaviorParamForm);
    if (tagParam.length === 0 && behaviorParam.length === 0) {
      message.error('没有要保存的模板，清先选择！');
      return;
    }
    const [res, err] = await editTemplateList({
      template_name: templateValue.tem_name,
      template_para: JSON.stringify({
        tagParamForm: tagParam,
        behaviorParamForm: behaviorParam,
      }),
      template_id: templateValue.id,
      owner_list: templateValue.tem_owner,
      template_type: templateValue.tem_type,
      remark: templateValue.tem_desc,
    });
    if (err) {
      message.error(err.message);
      return;
    }
    message.success('模板修改成功');
    setShowEditTemplateDialog(false);
  };
  const submitTemplate = async (templateValue: any, setShowAddTemplateDialog: any) => {
    const fieldsValue = form.getFieldsValue();
    const { tagParamForm, behaviorParamForm } = fieldsValue;
    const tagParam = TagParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(tagParamForm);
    const behaviorParam = BehaviorParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(behaviorParamForm);
    if (tagParam.length === 0 && behaviorParam.length === 0) {
      message.error('没有要保存的模板，清先选择！');
      return;
    }
    const [res, err] = await addTemplateList({
      template_name: templateValue.tem_name,
      template_para: JSON.stringify({
        tagParamForm: tagParam,
        behaviorParamForm: behaviorParam,
      }),
      owner_list: templateValue.tem_owner,
      template_type: templateValue.tem_type,
      remark: templateValue.tem_desc,
      data_type: templateValue.data_type,
    });
    if (err) {
      message.error(err.message);
      return;
    }
    message.success('模板添加成功');
    setShowAddTemplateDialog(false);
  };

  const handleSubmit = useMemoizedFn(async () => {
    const actionModeMap = {
      create: runCreateUserPackageTask,
      edit: runEditUserPackageTask,
      copy: runCreateUserPackageTask,
    };
    try {
      await form.validateFields(); // 校验当前表单，注意这是个异步的过程，需要使用await
    } catch (e) {
      if (
        // @ts-ignore
        every(e?.errorFields, (errorField) => {
          return includes(['tagParamForm', 'behaviorParamForm'], errorField.name[0]);
        })
      ) {
        message.warning('当前有筛选条件未配置，请配置该条件后重新提交');
      } else {
        message.warning('当前表单校验失败，请检查后重新提交');
      }

      return;
    }
    const fieldsValue = form.getFieldsValue(); // 获取所有表单项的值

    const extraValidateResult = extraValidateForExtractParams(fieldsValue, currentTaskType);
    if (!extraValidateResult) {
      return;
    }

    if (mode === 'create' || mode === 'copy') {
      // @ts-ignore
      eventTrackingReport({
        event_type: 'button',
        event_detail: '创建分群',
        from_system: window.top === window.self ? '商机' : '其他',
      });
    }

    const backendFormatTaskDetail = await convertTaskDetailToBackendFormat(
      fieldsValue,
      mode,
      taskId,
      isAllowEditExtractCondition,
      taskInstanceCache,
    );
    // @ts-ignore
    actionModeMap[mode](backendFormatTaskDetail);
  });

  return {
    form,
    getUserPackageTaskDetailLoading,
    handleSubmit,
    btnSubmitLoading: createUserPackageTaskLoading || editUserPackageTaskLoading,
    onPredictUserPackageSize,
    predictUserPackageSizeState: restStateForPredictUserPackageSize,
    onFormFieldsValuesChange,
    clearPackageSizePredictResult,
    isAllowEditExtractCondition,
    isTaskDetailReadyWhenNeed,
    currentTaskType,
    importFieldsValue,
    importFieldsLevel,
    setImportFieldsLevel,
    setParamType,
    taskInstanceCache,
    setTaskInstanceCache,
    dataType,
    importInitValue,
    submitTemplate,
    applyTemplate,
    updateTemplate,
    setDataType,
  };

  async function convertTaskDetailToBackendFormat(
    frontendTaskDetail: any,
    mode: string,
    taskId: number,
    isAllowEditExtractCondition: boolean,
    taskInstanceCache: any,
  ) {
    const {
      periodEndDate,
      is_distinct: isDistinct,
      distinct_days: distinctDays,
      period_type: periodType,
      globalLogicForTagParamForm,
      tagParamForm,
      globalLogicForBehaviorParamForm,
      behaviorParamForm,
      existedPkgForm,
      task_expire_notify: notify,
      extract_error_or_zero_notify: zeroNotify,
      extract_out_limit_percent_check: limitCheck,
      extract_out_limit_percent: limit,
      period_time: periodTime,
      extract_limit_num,
    } = frontendTaskDetail;

    const { periodDetail, partOfTypePara } = handleFieldsRelateToPeriodType({
      periodType,
      periodEndDate,
      isDistinct,
      distinctDays,
      periodTime,
    });

    let alertDetail;
    if (periodType === 'day') {
      alertDetail = {
        task_expire_notify: notify ? 1 : 0,
        extract_error_or_zero_notify: zeroNotify ? 1 : 0,
      };
      if (limitCheck) {
        // @ts-ignore
        alertDetail.extract_out_limit_percent = limit;
      }
    }

    const isCurrentTaskIsPkgImport = currentTaskType === 'pkg_import';

    const layoutJsonObj = {
      tagParamForm_format_version: 'v1.0',
      globalLogicForTagParamForm,
      tagParamForm: TagParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(tagParamForm),
      globalLogicForBehaviorParamForm,
      behaviorParamForm: BehaviorParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(behaviorParamForm),
      ...(isCurrentTaskIsPkgImport ? { existedPkgForm } : {}),
    };

    return {
      ...pick(
        frontendTaskDetail,
        mode === 'create' || mode === 'copy' ? frontendBackendSameStructureFieldList : ['task_name', 'owner_list'],
      ),
      ...(mode === 'create' || mode === 'copy'
        ? {
            period_detail: periodDetail,
            task_type: currentTaskType,
            alert_detail: alertDetail,
            type_para: {
              ...partOfTypePara,
              extract_limit_num,
              inner_condition: await buildCondition({
                currentTaskType,
                tagParamForm,
                globalLogicForTagParamForm,
                behaviorParamForm,
                globalLogicForBehaviorParamForm,
                existedPkgForm,
                // @ts-ignore
                taskInstanceCache,
              }),
            },
            layout: JSON.stringify(layoutJsonObj),
          }
        : {}),
      ...(mode === 'edit' && isAllowEditExtractCondition
        ? {
            type_para: {
              ...partOfTypePara,
              inner_condition: await buildCondition({
                currentTaskType,
                tagParamForm,
                globalLogicForTagParamForm,
                behaviorParamForm,
                globalLogicForBehaviorParamForm,
                existedPkgForm,
                // @ts-ignore
                taskInstanceCache,
              }),
            },
            layout: JSON.stringify(layoutJsonObj),
          }
        : {}),
      ...(mode === 'edit' && !!taskId ? { task_id: taskId } : {}),
    };

    function handleFieldsRelateToPeriodType({ periodType, periodEndDate, isDistinct, distinctDays, periodTime }: any) {
      const isPeriodTypeOnce = periodType === 'once';
      let todayDateStr;
      let currentTimeStr;
      if (isPeriodTypeOnce) {
        todayDateStr = moment().format('YYYY-MM-DD');
        currentTimeStr = moment().format('HH:mm:ss');
      } else {
        todayDateStr = moment().format('YYYY-MM-DD');
        currentTimeStr = periodTime ? periodTime.format('HH:mm:ss') : '10:30:00';
      }
      const periodDetail = isPeriodTypeOnce
        ? { beginDate: todayDateStr, periodTime: currentTimeStr }
        : {
            beginDate: todayDateStr,
            endDate: moment.isMoment(periodEndDate) ? periodEndDate.format('YYYY-MM-DD') : todayDateStr,
            periodTime: currentTimeStr,
          };

      return {
        periodDetail,
        partOfTypePara: isPeriodTypeOnce
          ? {
              is_distinct: 0,
              distinct_days: 0,
            }
          : {
              is_distinct: isDistinct ? 1 : 0,
              distinct_days: isDistinct ? distinctDays : 0,
            },
      };
    }
  }

  async function buildCondition({
    currentTaskType,
    tagParamForm,
    globalLogicForTagParamForm,
    behaviorParamForm,
    globalLogicForBehaviorParamForm,
    existedPkgForm,
  }: any) {
    const isCurrentTaskIsPkgImport = currentTaskType === 'pkg_import';
    return {
      global_logic: 'AND',
      user_property: TagParamInputGroup.convertFrontendFieldsValueToBackendFormat(
        tagParamForm,
        globalLogicForTagParamForm,
        { backendIdFieldName: 'id' },
      ),
      user_action: BehaviorParamInputGroup.convertFrontendFieldsValueToBackendFormat(
        behaviorParamForm,
        globalLogicForBehaviorParamForm,
      ),
      ...(!isCurrentTaskIsPkgImport || isEmpty(existedPkgForm?.basePkgInstIds)
        ? {}
        : {
            pkg_condition: await ExistedPkgForm.convertFrontendFieldsValueToBackendFormat(
              existedPkgForm,
              taskInstanceCache,
            ),
          }),
    };
  }
}

export function convertTaskDetailToFrontendFormat(backendTaskDetail: any, currentTaskType: string) {
  if (!currentTaskType) {
    throw new Error('必须传入currentTaskType参数');
  }
  const {
    period_type: periodType,
    period_detail: periodDetail,
    alert_detail: alertDetail,
    layout: layoutJsonStr,
    type_para: typePara,
  } = backendTaskDetail;
  // const periodEndDate =
  //   periodType === 'once' ? undefined : moment(periodDetail?.endDate)
  const layoutJsonObj = JSON.parse(layoutJsonStr);

  const isCurrentTaskIsPkgImport = currentTaskType === 'pkg_import';

  const fieldsValue = {
    ...pick(backendTaskDetail, frontendBackendSameStructureFieldList),
    ...handleFieldsRelateToPeriodType({
      periodType,
      periodDetail,
      isDistinct: typePara?.is_distinct,
      distinctDays: typePara?.distinct_days,
    }),
    extract_limit_num: typePara?.extract_limit_num,
    task_expire_notify: get(alertDetail, 'task_expire_notify') === 1,
    extract_error_or_zero_notify: get(alertDetail, 'extract_error_or_zero_notify') === 1,
    extract_out_limit_percent_check: !!get(alertDetail, 'extract_out_limit_percent'),
    extract_out_limit_percent: get(alertDetail, 'extract_out_limit_percent')
      ? get(alertDetail, 'extract_out_limit_percent')
      : undefined,
    globalLogicForTagParamForm: layoutJsonObj.globalLogicForTagParamForm,
    tagParamForm: TagParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(layoutJsonObj.tagParamForm),
    globalLogicForBehaviorParamForm: layoutJsonObj.globalLogicForBehaviorParamForm,
    behaviorParamForm: BehaviorParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(
      layoutJsonObj.behaviorParamForm,
    ),
    ...(isCurrentTaskIsPkgImport ? { existedPkgForm: layoutJsonObj.existedPkgForm } : {}),
  };

  return fieldsValue;

  function handleFieldsRelateToPeriodType({ periodType, periodDetail, isDistinct, distinctDays }: any) {
    const isPeriodTypeOnce = periodType === 'once';
    return {
      periodEndDate: isPeriodTypeOnce ? undefined : moment(periodDetail?.endDate),
      is_distinct: isPeriodTypeOnce ? undefined : !!isDistinct,
      distinct_days: isPeriodTypeOnce || !isDistinct ? undefined : distinctDays,
      period_time: isPeriodTypeOnce
        ? moment(`${periodDetail?.beginDate} ${periodDetail?.periodTime}`, 'YYYY-MM-DD HH:mm:ss')
        : moment(periodDetail?.periodTime, 'HH:mm:ss'),
    };
  }
}

function extraValidateForExtractParams(
  { tagParamForm, behaviorParamForm, existedPkgForm }: any,
  currentTaskType: string,
) {
  const isCurrentTaskIsPkgImport = currentTaskType === 'pkg_import';
  if (isEmpty(tagParamForm) && isEmpty(behaviorParamForm) && isEmpty(existedPkgForm?.basePkgInstIds)) {
    if (isEmpty(existedPkgForm?.interPkgInstIds) && isEmpty(existedPkgForm?.diffPkgInstIds)) {
      const warningWording = isCurrentTaskIsPkgImport
        ? '导入分群、标签圈选参数、行为圈选参数不能都为空'
        : '标签圈选参数、行为圈选参数不能都为空';
      message.warning(warningWording);
    } else {
      message.warning('目标分群不能为空');
    }

    return false;
  }

  return true;
}
