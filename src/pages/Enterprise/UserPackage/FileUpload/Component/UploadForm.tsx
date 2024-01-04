import React from 'react';
import { isEmpty, last, split } from 'lodash';
import { Card, Form, Row, Col, Radio, Typography, Spin } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
// import { Files as filesInterface } from '@shared/apps/enterprise/config/interface'
import { dataTypeOptions } from '../../config';
import CosUpload from '../../../Common/Components/CosUpload/CosUpload';

export function downloadExcel(
  contextData: any,
  sheetName: string,
  fileName: string,
  bookType = 'xlsx',
  jsonToSheetParams = {},
) {
  return import('xlsx').then(({ default: xlsx }) => {
    const ws = xlsx.utils.json_to_sheet(contextData, jsonToSheetParams);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, sheetName);
    xlsx.writeFile(wb, fileName, { bookType } as any);
  });
}

function uploadedFilesValidator(rule: any, value: any) {
  if (isEmpty(value)) {
    return Promise.reject(new Error('请上传文件'));
  }

  const uploadStatus = value?.[0]?.status;

  if (uploadStatus === 'uploading') {
    return Promise.reject(new Error('请等候文件上传完成'));
  }
  if (uploadStatus === 'error') {
    return Promise.reject(new Error('文件上传失败，请重新上传'));
  }
  if (uploadStatus !== 'done') {
    return Promise.reject(new Error('文件上传校验失败'));
  }

  return Promise.resolve();
}

function exportUploadExampleExcelForUin() {
  const excelData = [{ uin: '1234567890' }, { uin: '12345678901' }, { uin: '123456789011' }];
  const fileName = 'UIN导入模板.xlsx';
  const tagName = 'UIN导入';

  downloadExcel(excelData, tagName, fileName, 'xlsx', {
    header: ['uin'],
    skipHeader: true,
  });
}

function exportUploadExampleExcelForCompanyName() {
  const excelData = [{ companyName: 'XXX有限公司' }, { companyName: 'YYY有限公司' }, { companyName: 'ZZZ有限公司' }];
  const fileName = '企业名称导入模板.xlsx';
  const tagName = '企业名称导入';

  downloadExcel(excelData, tagName, fileName, 'xlsx', {
    header: ['companyName'],
    skipHeader: true,
  });
}

export function UploadForm({ form, disabled, env, setCosBucket }: any) {
  const dataTypeValue = Form.useWatch('data_type', form);
  const uploadedFilesValue = Form.useWatch('uploadedFiles', form);
  const { status: uploadStatus, realName: uploadedFilePath } = uploadedFilesValue?.[0] ?? {};
  return (
    <Card title='导入文件' className='mb15'>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name='data_type' label='实体类型'>
            <Radio.Group options={dataTypeOptions} optionType='button' disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>
      {!disabled && (
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label='文件模板'>
              <>
                {dataTypeValue === 'uin' && (
                  <Typography.Link onClick={exportUploadExampleExcelForUin}>UIN导入模板</Typography.Link>
                )}
                {dataTypeValue === 'company' && (
                  <Typography.Link onClick={exportUploadExampleExcelForCompanyName}>企业名称导入模板</Typography.Link>
                )}
              </>
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        <Col span={16}>
          <Spin spinning={uploadStatus === 'uploading'} tip='上传中'>
            <Form.Item
              label='上传文件'
              name='uploadedFiles'
              rules={[{ validator: uploadedFilesValidator }]}
              hidden={disabled}
            >
              <CosUpload
                isView={true}
                size={1}
                maxCount={1}
                env={env}
                supportedFileType='.xlsx'
                setCosBucket={setCosBucket}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              />
            </Form.Item>
            {uploadStatus === 'done' && uploadedFilePath && (
              <Typography.Text type='success'>
                <FileDoneOutlined /> {last(split(uploadedFilePath, '/'))}
              </Typography.Text>
            )}
          </Spin>
        </Col>
      </Row>
    </Card>
  );
}
UploadForm.displayName = 'UploadForm';
