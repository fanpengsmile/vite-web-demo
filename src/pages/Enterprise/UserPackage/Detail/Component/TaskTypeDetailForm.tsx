import React from 'react';
import { Card, Form } from 'antd';
import { TagParamForm } from '../../Edit/Component/TagParamForm';
import { BehaviorParamForm } from '../../Edit/Component/BehaviorParamForm';
import { ExistedPkgForm } from '../../Edit/Component/ExistedPkgForm';
import { UploadForm } from '../../FileUpload/Component/UploadForm';

export const TaskTypeDetailForm = ({ form, taskType, isTaskDetailReadyWhenNeed, dataType }: any) => {
  return (
    <Form form={form}>
      {taskType && (
        <>
          {taskType === 'pkg_import' && (
            <Card title='分群策略' className='mb15'>
              <ExistedPkgForm
                mode='detail'
                isTaskDetailReadyWhenNeed={isTaskDetailReadyWhenNeed}
                disabled
                dataType={dataType}
              />
              <TagParamForm dataType={dataType} form={form} disabled size='small' />
              <BehaviorParamForm form={form} disabled size='small' />
            </Card>
          )}
          {taskType === 'extract' && (
            <Card title='分群策略' className='mb15'>
              <TagParamForm dataType={dataType} form={form} disabled size='small' />
              <BehaviorParamForm form={form} disabled size='small' />
            </Card>
          )}
          {taskType === 'upload' && <UploadForm form={form} disabled />}
        </>
      )}
    </Form>
  );
};
TaskTypeDetailForm.displayName = 'TaskTypeDetailForm';
