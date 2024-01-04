/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { includes, isEmpty, delay, pick } from 'lodash';
import moment from 'moment';
import { Form, Spin, message, Button } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { BasicInfoForm } from './BasicInfoForm';
import { UploadForm } from './UploadForm';
import { useNavigate } from 'react-router-dom';
import {
  useRequestGetUserPackageTaskDetail,
  useRequestCreateUserPackageTask,
  useRequestEditUserPackageTask,
} from '../../../base/cgi';
import { usePvReport } from '../../../Common/util';
import { CosConfig } from '../../../Common/Components/CosUpload/util';

const formInitialValues = {
  task_name: '',
  data_type: 'uin',
  owner_list: '',
};

export function UserPackageUpload({
  common: { panshiAuthMap, env },
  route,
  match,
  id: taskId,
  mode,
  modeStr,
  history,
  fromSystem,
}: any) {
  const { form, getUserPackageTaskDetailLoading, handleSubmit, btnSubmitLoading, isUploadFormDisabled, setCosBucket } =
    // eslint-disable-next-line no-use-before-define
    useUserPackageUpload({
      panshiAuthMap,
      taskId,
      mode,
      modeStr,
      history,
      fromSystem,
    });

  const handleFormValuesChange = (changedValues: any) => {
    if (includes(['error', 'done'], changedValues?.uploadedFiles?.[0]?.status)) {
      usePvReport(route, match, {
        event_type: 'button',
        event_detail: '上传文件',
      });
    }
  };

  return (
    <div style={{ minWidth: 1400 }}>
      <Spin spinning={!!getUserPackageTaskDetailLoading}>
        <Form form={form} initialValues={formInitialValues} onValuesChange={handleFormValuesChange}>
          <BasicInfoForm
            // @ts-ignore
            mode={mode}
          />
          <UploadForm
            setCosBucket={setCosBucket}
            env={env}
            // @ts-ignore
            mode={mode}
            disabled={isUploadFormDisabled}
          />
        </Form>
        <div style={{ textAlign: 'right' }}>
          <Button type='primary' loading={btnSubmitLoading} onClick={handleSubmit}>
            {modeStr}分群
          </Button>
        </div>
      </Spin>
    </div>
  );
}
UserPackageUpload.displayName = 'UserPackageUpload';

function useUserPackageUpload({ taskId, mode, modeStr, panshiAuthMap }: any) {
  const isAllowEditExtractCondition = !!panshiAuthMap?.enterprisePackageManage?.availableForEditPackageExtractCondition;
  const [form] = Form.useForm();
  const [cosBucket, setCosBucket] = useState({});
  const navigate = useNavigate();
  const { getUserPackageTaskDetailLoading } = useRequestGetUserPackageTaskDetail({
    taskId,
    enable: mode === 'edit' || mode === 'copy',
    onSuccess(backendTaskDetail) {
      if ((mode === 'edit' || mode === 'copy') && !isEmpty(backendTaskDetail)) {
        // eslint-disable-next-line no-use-before-define
        form.setFieldsValue(convertTaskDetailToFrontendFormat(backendTaskDetail));
      }
    },
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

  const handleSubmit = useMemoizedFn(async () => {
    const actionModeMap = {
      create: runCreateUserPackageTask,
      edit: runEditUserPackageTask,
      copy: runCreateUserPackageTask,
    };
    try {
      await form.validateFields(); // 校验当前表单，注意这是个异步的过程，需要使用await
    } catch (e) {
      message.warning('当前表单校验失败，请检查后重新提交');

      return;
    }
    const fieldsValue = form.getFieldsValue(); // 获取所有表单项的值

    // eslint-disable-next-line no-use-before-define
    const backendFormatTaskDetail = convertTaskDetailToBackendFormat(fieldsValue, mode, taskId);
    // @ts-ignore
    actionModeMap[mode](backendFormatTaskDetail);
  });

  return {
    setCosBucket,
    form,
    getUserPackageTaskDetailLoading,
    handleSubmit,
    btnSubmitLoading: createUserPackageTaskLoading || editUserPackageTaskLoading,
    isUploadFormDisabled: mode === 'edit' && !isAllowEditExtractCondition,
  };

  function convertTaskDetailToBackendFormat(frontendTaskDetail: any, mode: string, taskId: number) {
    // const { realName: uploadedFilePath, bucket } =
    //   frontendTaskDetail?.uploadedFiles?.[0] ?? {}
    const bucket = CosConfig.bucketName;
    const uploadedFilePath = cosBucket;
    const todayMoment = moment();
    const todayDateStr = todayMoment.format('YYYY-MM-DD');
    const currentTimeStr = todayMoment.format('HH:mm:ss');
    return {
      ...pick(frontendTaskDetail, ['task_name', 'data_type', 'owner_list']),
      task_type: 'upload',
      period_type: 'once',
      period_detail: {
        beginDate: todayDateStr,
        periodTime: currentTimeStr,
      },

      ...((mode === 'create' || mode === 'copy' || (mode === 'edit' && isAllowEditExtractCondition)) && {
        type_para: {
          cosBucket: bucket,
          cosFilename: uploadedFilePath,
        },
      }),

      ...(mode === 'edit' && !!taskId ? { task_id: taskId } : {}),
    };
  }
}

export function convertTaskDetailToFrontendFormat(backendTaskDetail: any) {
  const { type_para: typePara } = backendTaskDetail ?? {};
  return {
    ...pick(backendTaskDetail, ['task_name', 'data_type', 'owner_list']),
    uploadedFiles: [
      {
        status: 'done',
        bucket: typePara?.cosBucket,
        realName: typePara?.cosFilename,
      },
    ],
  };
}
