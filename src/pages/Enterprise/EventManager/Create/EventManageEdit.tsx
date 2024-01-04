import React from 'react';
import { Button, Spin } from 'antd';
import { EditForm, useEditForm } from './EditForm';
import { ColumnFieldList } from './ColumnFieldList';
import { useNavigate } from 'react-router-dom';
import { delay } from 'lodash';

export function EventManageEdit({ mode, eventId, common: { staffname } }: any) {
  const navigate = useNavigate();
  const {
    form,
    eventDetailLoading,
    submitLoading,
    handleSubmit,
    importData,
    setImportData,
    setFtId,
    ...restStateForEditForm
  } = useEditForm({
    initMode: mode, // 指定初始值
    initId: eventId, // 指定初始值
    onSubmitSuccess: () => {
      delay(() => {
        navigate(`/enterprise/portrait_meta/event_manage/list`);
      }, 1000);
    },
  });

  const loading = !!eventDetailLoading || !!submitLoading;

  return (
    <div style={{ minWidth: 1200 }}>
      <Spin spinning={loading}>
        <EditForm
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mode={mode}
          form={form}
          setFtId={setFtId}
          setImportData={setImportData}
          staffname={staffname}
          {...restStateForEditForm}
        />
        <ColumnFieldList mode={mode} data={importData} setImportData={setImportData} />
        {mode !== 'detail' && (
          <div style={{ textAlign: 'right' }}>
            <Button
              key='submit'
              type='primary'
              loading={submitLoading}
              disabled={eventDetailLoading}
              onClick={handleSubmit}
            >
              提交
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
}
EventManageEdit.displayName = 'EventManageEdit';
