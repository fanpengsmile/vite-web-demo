import React, { useState } from 'react';
import { Modal, Spin, message } from 'antd';
import { useBoolean, useSafeState } from 'ahooks';
import { useRequestImportTagConfig } from '../../base/cgi';
import CosUpload from '../../Common/Components/CosUpload/CosUpload';
import { CosConfig } from '../../Common/Components/CosUpload/util';
import { isFunction, get } from 'lodash';

export function ImportDialog({
  visible,
  hideImportDialog,
  handleUploadDraggerChange,
  handleBeforeUpload,
  isUploading,
  spinningTip,
  env,
  setCosBucket,
}: any) {
  return (
    <Modal title='导入' open={visible} maskClosable={false} onCancel={hideImportDialog} footer={null}>
      <Spin spinning={isUploading} tip={spinningTip}>
        <CosUpload
          isView={true}
          size={1}
          maxCount={1}
          env={env}
          setCosBucket={setCosBucket}
          beforeUpload={handleBeforeUpload}
          onChange={handleUploadDraggerChange}
          uploadHint='支持扩展名：.xlsx'
          supportedFileType='.xlsx'
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        />
        {/* <UploadDragger
          dir="ent-map/tag_dict"
          action={UPLOAD_URL}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          uploadHint="支持扩展名：.xlsx"
          beforeUpload={handleBeforeUpload}
          onChange={handleUploadDraggerChange}
        /> */}
      </Spin>
    </Modal>
  );
}

export function useImportDialog({ afterImportSuccess }: any) {
  const [visible, { setTrue: showImportDialog, setFalse: hideImportDialog }] = useBoolean(false);
  const [isUploading, setIsUploading] = useSafeState(false);
  const [spinningTip, setSpinningTip] = useSafeState('');
  const [cosbucket, setCosBucket] = useState({});

  const { runRequestImportTagConfig } = useRequestImportTagConfig(
    () => {
      // eslint-disable-next-line no-unused-expressions
      isFunction(afterImportSuccess) && afterImportSuccess();
      setIsUploading(false);
      hideImportDialog();
      message.success('标签导入成功，当前为您展示新导入的标签');
    },
    () => {
      setIsUploading(false);
    },
  );

  /**
   * 处理文件上传事件，本回调函数在上传过程会被触发数次，关键是要等到status字段变为'done'
   * @param {Object} fileInfo
   */
  const handleUploadDraggerChange = async (fileInfo: any) => {
    const { status } = get(fileInfo, '0');
    const realName = cosbucket;
    const bucket = CosConfig.bucketName;
    if (status !== 'done') return; // 注意要等到status字段变为'done'才算是上传完成
    setSpinningTip('导入中');
    runRequestImportTagConfig(bucket, realName);
  };

  const handleBeforeUpload = () => {
    setIsUploading(true);
    setSpinningTip('上传中');
  };

  return {
    visible,
    showImportDialog,
    hideImportDialog,
    isUploading,
    spinningTip,
    handleUploadDraggerChange,
    handleBeforeUpload,
    setCosBucket,
  };
}
