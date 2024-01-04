import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, DatePicker, Button, Checkbox, Row, Col, TimePicker } from 'antd';
import { periodTypeOptions, extractionRatio } from '../../config';
import { PredictUserPackageSize } from '../../../Common/Components/TagInput/PredictUserPackageSize';
import { TemplateDialog } from './TemplateDialog';
import moment from 'moment';

export function FooterForm({
  mode,
  modeStr,
  form,
  onSubmit,
  btnSubmitLoading,
  onPredictUserPackageSize,
  predictUserPackageSizeState,
  showPredictUserPackageSize = false,
  dataType = 'uin',
  showTemplate = false,
  submitTemplate,
}: any) {
  const periodTypeValue = Form.useWatch('period_type', form);
  const isDistinct = Form.useWatch('is_distinct', form);
  const isPeriodTypeOnce = periodTypeValue === 'once';
  const isEditMode = mode === 'edit';
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);

  return (
    <Card>
      <TemplateDialog
        showAddTemplateDialog={showAddTemplateDialog}
        setShowAddTemplateDialog={setShowAddTemplateDialog}
        dataType={dataType}
        submit={submitTemplate}
      ></TemplateDialog>
      <div style={{ display: 'flex' }}>
        <Form.Item
          // eslint-disable-next-line no-nested-ternary
          label={dataType === 'phone' ? '预估电话号码数' : dataType === 'uin' ? '预估用户UIN数' : '预估企业SID数'}
          style={{ marginRight: 30 }}
          hidden={!showPredictUserPackageSize}
        >
          <PredictUserPackageSize
            onPredictUserPackageSize={onPredictUserPackageSize}
            {...predictUserPackageSizeState}
          />
        </Form.Item>
        {/* <Form.Item label="数量上限" style={{ marginRight: 30 }}>
          <InputNumber></InputNumber>
        </Form.Item> */}
        <Form.Item name='extract_limit_num' label='数量上限' style={{ marginRight: 30 }}>
          <InputNumber disabled={isEditMode} style={{ width: 120 }}></InputNumber>
        </Form.Item>
        <Form.Item
          style={{ marginRight: 30 }}
          name='period_type'
          label='更新周期'
          rules={[{ required: true, message: '请选择更新周期' }]}
        >
          <Select style={{ width: 120 }} options={periodTypeOptions} disabled={isEditMode} />
        </Form.Item>
        <Form.Item style={{ flex: 1, textAlign: 'right' }}>
          {showTemplate ? (
            <Button
              type='primary'
              onClick={() => {
                setShowAddTemplateDialog(true);
              }}
              style={{ marginRight: '10px' }}
            >
              保存模板
            </Button>
          ) : null}
          <Button type='primary' loading={btnSubmitLoading} onClick={onSubmit}>
            {modeStr}分群
          </Button>
        </Form.Item>
      </div>
      <div style={{ display: 'flex' }}>
        <Form.Item
          style={{ marginRight: 30 }}
          hidden={isPeriodTypeOnce}
          name='period_time'
          label='提取时间点'
          rules={[{ required: false, message: '请选择提取时间点' }]}
        >
          <TimePicker
            disabled={isEditMode}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            defaultValue={moment('10:30:00', 'HH:mm:ss')}
          ></TimePicker>
        </Form.Item>
        <Form.Item
          style={{ marginRight: 30 }}
          name='periodEndDate'
          label='有效期至'
          hidden={isPeriodTypeOnce}
          rules={[{ required: !isPeriodTypeOnce, message: '不能为空' }]}
        >
          <DatePicker disabled={isEditMode} />
        </Form.Item>
        <Form.Item name='is_distinct' hidden={isPeriodTypeOnce} style={{ marginRight: 5 }} valuePropName='checked'>
          <Checkbox />
        </Form.Item>
        <Form.Item hidden={isPeriodTypeOnce} style={{ marginRight: 5 }}>
          <span>与过去</span>
        </Form.Item>
        <Form.Item
          style={{ marginRight: 5 }}
          name='distinct_days'
          hidden={isPeriodTypeOnce}
          rules={[{ required: !isPeriodTypeOnce && isDistinct, message: '不能为空' }]}
        >
          <InputNumber size='small' min={1} max={999} style={{ width: 60 }} controls={false} />
        </Form.Item>
        <Form.Item hidden={isPeriodTypeOnce} style={{ marginRight: 5 }}>
          <span>天内已提取用户去重</span>
        </Form.Item>
      </div>
      {isPeriodTypeOnce ? null : (
        <>
          <div style={{ display: 'flex', marginTop: '-20px' }}>
            <Form.Item style={{ marginRight: 30, marginBottom: '0' }} label='通知告警(选填)'></Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name='task_expire_notify'
                  valuePropName='checked'
                  style={{ marginRight: 30, marginBottom: '0' }}
                >
                  <Checkbox disabled={isEditMode}>
                    周期分群任务
                    <span style={{ color: '#3da8f5' }}>到期前3天和到期当天</span>
                    通知提醒
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name='extract_error_or_zero_notify'
                  valuePropName='checked'
                  style={{ marginRight: 30, marginBottom: '0' }}
                >
                  <Checkbox disabled={isEditMode}>
                    分群任务
                    <span style={{ color: '#3da8f5' }}>提取失败或提取为0</span>
                    通知提醒
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name='extract_out_limit_percent_check'
                  valuePropName='checked'
                  style={{ float: 'left', marginBottom: '0' }}
                >
                  <Checkbox disabled={isEditMode}>分群用户提取用户超过500且超过前一天的</Checkbox>
                </Form.Item>
                <Form.Item
                  style={{
                    marginBottom: '0',
                    float: 'left',
                    marginRight: '3px',
                  }}
                  name='extract_out_limit_percent'
                >
                  <Select style={{ width: 100 }} size='small' disabled={isEditMode} options={extractionRatio} />
                </Form.Item>
                <Form.Item
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  disabled={isEditMode}
                  style={{ marginBottom: '0', float: 'left' }}
                >
                  通知提醒
                </Form.Item>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Card>
  );
}
FooterForm.displayName = 'FooterForm';
