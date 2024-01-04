/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { Form } from 'antd';
import { useSafeState } from 'ahooks';
import { useRequestGetUserPackageTaskDetail } from '../../../base/cgi';
import { BasicInfoCard } from './BasicInfoCard';
import { TaskTypeDetailForm } from './TaskTypeDetailForm';
import { HistoryDetail, useHistoryDetail } from '../../Edit/Component/HistoryDetail/HistoryDetail';
import { isEmpty } from 'lodash';
import { CustomTag } from './CustomTag';
import { convertTaskDetailToFrontendFormat as convertTaskDetailToFrontendFormatForExtract } from '../../Edit/UserPackageEdit';
import { convertTaskDetailToFrontendFormat as convertTaskDetailToFrontendFormatForUpload } from '../../FileUpload/Component/UserPackageUpload';

const convertTaskDetailToFrontendFormatMap = {
  extract: convertTaskDetailToFrontendFormatForExtract,
  pkg_import: convertTaskDetailToFrontendFormatForExtract,
  upload: convertTaskDetailToFrontendFormatForUpload,
};

export function UserPackageDetail({ taskId, common }: any) {
  const {
    userPackageTaskDetail,
    getUserPackageTaskDetailLoading,
    historyDetailState,
    currentTaskType,
    taskTypeDetailForm,
    isTaskDetailReadyWhenNeed,
    detailTask,
    // eslint-disable-next-line no-use-before-define
  } = useUserPackageDetail({
    taskId,
  });
  // @ts-ignore
  const dataType = detailTask?.data_type;

  return (
    <>
      <BasicInfoCard
        userPackageTaskDetail={userPackageTaskDetail}
        getUserPackageTaskDetailLoading={getUserPackageTaskDetailLoading}
      />

      <TaskTypeDetailForm
        form={taskTypeDetailForm}
        taskType={currentTaskType}
        dataType={dataType}
        isTaskDetailReadyWhenNeed={isTaskDetailReadyWhenNeed}
      />

      <HistoryDetail
        taskId={taskId}
        dataType={dataType}
        common={common}
        userPackageTaskDetail={userPackageTaskDetail}
        {...historyDetailState}
      />

      <CustomTag detailTask={detailTask} taskId={taskId} dataType={dataType}></CustomTag>
    </>
  );
}
UserPackageDetail.displayName = 'UserPackageDetail';

function useUserPackageDetail({ taskId }: { taskId: number }) {
  const [currentTaskType, setCurrentTaskType] = useSafeState();
  const [detailTask, setDetailTask] = useState();
  const [isTaskDetailReadyWhenNeed, setIsTaskDetailReadyInEditMode] = useSafeState(false);
  const [taskTypeDetailForm] = Form.useForm();
  const { getUserPackageTaskDetailLoading, userPackageTaskDetail } = useRequestGetUserPackageTaskDetail({
    taskId,
    enable: true,
    onSuccess(backendTaskDetail) {
      if (!isEmpty(backendTaskDetail)) {
        const { task_type: taskType } = backendTaskDetail;
        setDetailTask(backendTaskDetail);
        const convertTaskDetailToFrontendFormat =
          // @ts-ignore
          convertTaskDetailToFrontendFormatMap[taskType];
        taskTypeDetailForm.setFieldsValue(convertTaskDetailToFrontendFormat(backendTaskDetail, taskType));

        setCurrentTaskType(taskType);
        setIsTaskDetailReadyInEditMode(true);
      }
    },
  });
  const historyDetailState = useHistoryDetail({ taskId });

  return {
    getUserPackageTaskDetailLoading,
    userPackageTaskDetail,
    taskTypeDetailForm,
    historyDetailState,
    currentTaskType,
    isTaskDetailReadyWhenNeed,
    detailTask,
  };
}
