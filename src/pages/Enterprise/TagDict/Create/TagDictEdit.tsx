import React from 'react';
import { Button, Spin } from 'antd';
import { EditForm, useEditForm } from './EditForm';
import { useNavigate } from 'react-router-dom';

export function TagDictEdit({ mode, tagId, tagGroup }: any) {
  const navigate = useNavigate();
  const {
    form,
    tagDetailLoading,
    submitLoading,
    handleSubmit,
    fieldValue: editDetail,
    ...restStateForEditForm
  } = useEditForm({
    initMode: mode, // 指定初始值
    initId: tagId, // 指定初始值
    tagGroup,
    onSubmitSuccess: () => {
      navigate(`/enterprise/portrait_meta/tag_dict/list`);
    },
  });

  const loading = !!tagDetailLoading || !!submitLoading;

  return (
    <Spin spinning={loading}>
      <EditForm
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mode={mode}
        form={form}
        {...restStateForEditForm}
        editDetail={editDetail}
      />
      {mode !== 'detail' && (
        <div style={{ textAlign: 'right' }}>
          <Button
            key='submit'
            type='primary'
            loading={submitLoading}
            disabled={tagDetailLoading}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </div>
      )}
    </Spin>
  );
}
TagDictEdit.displayName = 'TagDictEdit';
