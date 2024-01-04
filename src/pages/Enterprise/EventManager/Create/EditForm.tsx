import React, { useState } from 'react';
import { Form, Card, Input, Select, Row, Col, message, InputNumber, Button } from 'antd';
import { get, pick, isFunction } from 'lodash';
import { useSafeState, useMount, useMemoizedFn } from 'ahooks';
import { getTableMetaData } from 'services/enterprise';
import { useEventDetail, useRequestAddEvent, useRequestEditEvent } from '../../base/cgi';
import { boolTypeFieldOptions, sourceTypeOptions } from '../config';
import StaffSelect from 'components/StaffSelect';
import FtSelect from '../../Common/Components/FtSelect';

const formInitialValues = {
  source_type: 'EVENT',
};

export function EditForm({ mode, form, staffname, setImportData, setFtId }: any) {
  const isDetailDisabled = mode === 'detail';
  const [fieldSource, setFieldSource] = useState();

  return (
    <Form
      form={form}
      onFieldsChange={(v) => {
        if (get(v, '0.name.0') === 'field_source') {
          setFieldSource(get(v, '0.value'));
        }
      }}
      layout='vertical'
      initialValues={formInitialValues}
    >
      <Card title='基本信息' className='mb15'>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label='数据源中文名' name='event_name' rules={[{ required: true }]}>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源表名' name='field_source' rules={[{ required: true }]}>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源类型' name='source_type' rules={[{ required: true }]}>
              <Select options={sourceTypeOptions} disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源一级目录' name='event_first_dir' rules={[{ required: true }]}>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源二级目录' name='event_second_dir' rules={[{ required: true }]}>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源三级目录' name='event_third_dir' rules={[{ required: true }]}>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='是否用于筛选' name='is_show' rules={[{ required: true }]}>
              <Select options={boolTypeFieldOptions} disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          {mode !== 'create' && (
            <>
              <Col span={8}>
                <Form.Item label='表ID' name='event_id'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='数据源顺序ID' name='order_id'>
                  <InputNumber min={1} style={{ width: '100%' }} disabled={isDetailDisabled} />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={8}>
            <Form.Item label='数据源归属部门/中心' name='ft'>
              <FtSelect
                disabled={isDetailDisabled}
                staffName={staffname}
                onCenterIdChange={(centerId: number) => {
                  setFtId(centerId);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='数据源负责人' name='owner_list'>
              <StaffSelect multiple placeholder='请输入关注人企微' disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='备注' name='remark'>
              <Input disabled={isDetailDisabled} />
            </Form.Item>
          </Col>
        </Row>
        {mode === 'create' ? (
          <Row gutter={24}>
            <Col span={8}>
              <Button
                onClick={async () => {
                  const [res, err] = await getTableMetaData({
                    field_source: fieldSource,
                  });
                  if (err) {
                    message.error(err.message);
                    return;
                  }
                  setImportData(res);
                }}
                type='primary'
              >
                导入列字段
              </Button>
            </Col>
          </Row>
        ) : null}
      </Card>
    </Form>
  );
}
EditForm.displayName = 'EditForm';

export function convertFieldsValueToBackendFormat(
  frontendFieldsValue: any,
  { mode, eventId }: any,
  // eslint-disable-next-line default-param-last
  data = [],
  ftId: number,
) {
  const fieldNameListForCreate = [
    'event_name',
    'source_type',
    'event_first_dir',
    'event_second_dir',
    'event_third_dir',
    'field_source',
    'ft',
    'is_show',
    'remark',
    'owner_list',
  ];
  const fieldNameListForEdit = [
    'event_name',
    'source_type',
    'event_first_dir',
    'event_second_dir',
    'event_third_dir',
    'field_source',
    'ft',
    'is_show',
    'remark',
    'order_id',
    'owner_list',
  ];

  const backendFieldsValue = pick(frontendFieldsValue, mode === 'edit' ? fieldNameListForEdit : fieldNameListForCreate);

  if (ftId) {
    backendFieldsValue.ft_id = +ftId;
  }

  if (data.length > 0) {
    backendFieldsValue.event_property = data.map((item: any) => {
      if (!item.field_en_name) {
        item.field_en_name = item.field_source_key;
      }
      if (!item.field_type) {
        item.field_type = 'DATE';
      }
      if (!item.property_type) {
        item.property_type = 'DIM';
      }
      if (!item.is_show) {
        item.is_show = 1;
      }
      return item;
    });
  }

  if (mode === 'edit') {
    backendFieldsValue.eventId = eventId;
  }

  return backendFieldsValue;
}

export function convertFieldsValueToFrontendFormat(backendFieldsValue: any) {
  const fieldNameList = [
    'event_id',
    'event_name',
    'source_type',
    'event_first_dir',
    'event_second_dir',
    'event_third_dir',
    'field_source',
    'ft',
    'is_show',
    'remark',
    'order_id',
    'owner_list',
  ];
  const frontendFieldsValue = pick(backendFieldsValue, fieldNameList);

  return frontendFieldsValue;
}

export function useEditForm({ initMode, initId, onSubmitSuccess }: any) {
  /* 表单所需状态 */
  const [form] = Form.useForm();
  const [id, setId] = useSafeState(initId);
  const [importData, setImportData] = useState([]);
  const [ftId, setFtId] = useState();
  const [mode, setMode] = useSafeState(initMode); // 可接受'detail'|'create'|'edit'
  const { eventDetailLoading, runRequestEventDetail } = useEventDetail(
    ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventDetail: eventDetailFromBackend,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      evenDetailList: eventDetailListFromBackend,
    }) => {
      form.setFieldsValue(convertFieldsValueToFrontendFormat(eventDetailFromBackend));
      setImportData(eventDetailListFromBackend);
    },
  );
  const { requestAddEventLoading, runRequestAddEvent } = useRequestAddEvent(() => {
    message.success('已新增数据源');
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSubmitSuccess) && onSubmitSuccess();
  });
  const { requestEditEventLoading, runRequestEditEvent } = useRequestEditEvent(() => {
    message.success('已编辑数据源');
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSubmitSuccess) && onSubmitSuccess();
  });

  const mountCb = useMemoizedFn(async () => {
    setMode(initMode);

    if (initId) {
      setId(initId);
      runRequestEventDetail(initId);
    }
  });
  useMount(mountCb);

  const handleSubmit = useMemoizedFn(async () => {
    try {
      await form.validateFields(); // 校验当前表单，注意这是个异步的过程，需要使用await
    } catch (e) {
      return;
    }

    const fieldsValue = form.getFieldsValue(); // 获取所有表单项的值
    const funcMap = {
      create: runRequestAddEvent,
      edit: runRequestEditEvent,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    funcMap[mode](
      convertFieldsValueToBackendFormat(
        fieldsValue,
        { mode, eventId: id },
        importData,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ftId,
      ),
    );
  });

  return {
    mode,
    form,
    handleSubmit,
    submitLoading: !!requestEditEventLoading || !!requestAddEventLoading,
    eventDetailLoading,
    importData,
    setImportData,
    setFtId,
  };
}
