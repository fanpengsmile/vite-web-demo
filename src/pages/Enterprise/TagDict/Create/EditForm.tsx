import React, { useEffect, useState } from 'react';
import { Form, Card, Input, Select, Row, Col, message } from 'antd';
import { get, clone, map, pick, reduce, find, isFunction } from 'lodash';
import { useSafeState, useMount, useMemoizedFn } from 'ahooks';
import { useTagDetail, useTagDirListManual, useRequestAddTag, useRequestEditTag } from '../../base/cgi';
import {
  IS_EXTRACT_SHOW_OPTIONS,
  IS_EXTRACT_TYPE_OPTIONS,
  // IS_EXTRACT_ENTITY_OPTIONS,
  IS_SELECT_OPTIONS,
  AUTHOR_ORDER_OPTIONS,
  fieldTypeOptions,
  tagGroupOptions,
} from '../config';

const fieldNameListFrontendSameAsBackend = [
  'field_source',
  'field_source_type',
  'field_source_key',
  'imp_date_key',
  'tag_name',
  'tag_en_name',
  'field_type',
  'calc_base_line',
  'tag_explain',
  'tag_dir_id',
  'is_extract_show',
  'tag_type',
  'create_type',
  'security_level',
  'status',
  'updated_at',
  'created_at',
  'tag_id',
  'coverage',
  'accuracy',
  'tag_dir_father_id',
  'is_download_show',
  'tag_group',
];
const editableTagFieldNameList = [
  'field_source',
  'field_source_type',
  'field_source_key',
  'imp_date_key',
  'tag_name',
  'tag_en_name',
  'tag_dir_father_id',
  'field_type',
  'calc_base_line',
  'tag_explain',
  'is_extract_show',
  'create_type',
  'tag_type',
  'security_level',
  'status',
  'is_download_show',
  'tag_group',
  'tag_dir_id',
];

export function EditForm({ mode, form, tagDirList, tagDirListLoading, editDetail }: any) {
  const isEditDisable = mode === 'edit';
  const [fieldValue, setFieldsValue] = useState({});
  const innerTagType = [
    { label: 'qcloud', value: 'qcloud' },
    { label: 'clouddc_uin', value: 'clouddc_uin' },
  ];
  const outerTagType = [
    { label: 'company', value: 'company' },
    { label: 'clouddc_cid', value: 'clouddc_cid' },
  ];
  const [tagType, setTagType] = useState(innerTagType);
  const extractShow = (v: number) => {
    return get(fieldValue, 'isExtractShow', []).length === 1 && get(fieldValue, 'isExtractShow.0') === v;
  };
  useEffect(() => {
    if (isEditDisable && editDetail?.tag_group) {
      if (editDetail?.tag_group === 'INNER') {
        setTagType(innerTagType);
      } else {
        setTagType(outerTagType);
      }
    }
  }, [editDetail]);

  return (
    <Card title='基本信息' className='mb15'>
      <Form
        onFieldsChange={(v) => {
          const fieldValueCopy = clone(fieldValue) as any;
          const value = get(v, '0.value');
          if (get(v, '0.name.0') === 'tag_group') {
            if (value === 'INNER') {
              setTagType(innerTagType);
            } else {
              setTagType(outerTagType);
            }
          }
          if (get(v, '0.name.0') === 'tag_type') {
            fieldValueCopy.tagType = value;
            setFieldsValue(fieldValueCopy);
          }
          if (get(v, '0.name.0') === 'is_extract_show') {
            fieldValueCopy.isExtractShow = value;
            setFieldsValue(fieldValueCopy);
            form.setFieldsValue({
              tag_type: undefined,
            });
          }
        }}
        form={form}
        layout='vertical'
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label='标签名(中文)' name='tag_name' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='标签名(英文)' name='tag_en_name' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='标签分类' name='tag_dir_id' rules={[{ required: !isEditDisable }]}>
              <Select
                options={map(tagDirList, ({ dirId, dirName }) => ({
                  value: dirId,
                  label: dirName,
                }))}
                loading={tagDirListLoading}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='标签ID类型' name='tag_group' rules={[{ required: !isEditDisable }]}>
              <Select options={tagGroupOptions} loading={tagDirListLoading} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='标签作用域' name='is_extract_show' rules={[{ required: true }]}>
              <Select mode='multiple' options={IS_EXTRACT_SHOW_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='提包标签来源' name='tag_type' rules={[{ required: !extractShow(0) }]}>
              <Select disabled={extractShow(0)} options={tagType} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='源表名称'
              name='field_source'
              rules={[
                {
                  required: !(
                    get(fieldValue, 'tagType') === 'clouddc_uin' || get(fieldValue, 'tagType') === 'clouddc_cid'
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='源表字段名' name='field_source_key' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='标签值类型' name='field_type' rules={[{ required: true }]}>
              <Select options={fieldTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='创建类型' name='create_type'>
              <Select options={IS_EXTRACT_TYPE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={16}>
            <Form.Item label='计算逻辑' name='calc_base_line'>
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label='	标签说明' name='tag_explain'>
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={8}>
            <Form.Item label='是否上线' name='status' rules={[{ required: true }]}>
              <Select options={IS_SELECT_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='权限等级' name='security_level'>
              <Select options={AUTHOR_ORDER_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
EditForm.displayName = 'EditForm';

export function convertFieldsValueToBackendFormat(frontendFieldsValue: any, { mode, tagId }: any) {
  const fieldsValue = pick(frontendFieldsValue, fieldNameListFrontendSameAsBackend);
  const backendFieldsValue = mode === 'edit' ? pick(fieldsValue, editableTagFieldNameList) : fieldsValue;

  if (mode === 'edit' && !!tagId) {
    backendFieldsValue.tagId = tagId;
  }

  return backendFieldsValue;
}

export function convertFieldsValueToFrontendFormat(backendFieldsValue: any, { tagDirList }: any) {
  const fieldsValue = pick(backendFieldsValue, fieldNameListFrontendSameAsBackend);

  const extract = [];
  if (fieldsValue.is_extract_show === 1) {
    extract.push(0);
  }
  if (fieldsValue.is_download_show === 1) {
    extract.push(1);
  }

  const frontendFieldsValue = {
    ...fieldsValue,
    is_extract_show: extract,
    tagGroup: fieldsValue.tag_group,
    tag_dir_id: reduce(
      tagDirList,
      (result, firstLevelDir) => {
        const findResult = find(firstLevelDir.children, {
          dirId: backendFieldsValue.tag_dir_id,
        });
        if (findResult) {
          return firstLevelDir.dirId;
        }
        return result;
      },
      0,
    ),
  };
  return frontendFieldsValue;
}

export function useEditForm({ initMode, initId, onSubmitSuccess, tagGroup }: any) {
  /* 表单所需状态 */
  const [form] = Form.useForm();
  const [id, setId] = useSafeState(initId);
  const [fieldValue, setFieldValue] = useState();
  const [mode, setMode] = useSafeState(initMode); // 可接受'detail'|'create'|'edit'
  const { tagDetailLoading, runAsyncRequestTagDetail } = useTagDetail(undefined, tagGroup);
  const { tagDirList, tagDirListLoading, runAsyncRequestTagDirList } =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useTagDirListManual(() => {}, true) as any;
  const { requestAddTagLoading, runRequestAddTag } = useRequestAddTag(() => {
    message.success('已新增标签');
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSubmitSuccess) && onSubmitSuccess();
  });
  const { requestEditTagLoading, runRequestEditTag } = useRequestEditTag(() => {
    message.success('已编辑标签');
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSubmitSuccess) && onSubmitSuccess();
  });

  const mountCb = useMemoizedFn(async () => {
    setMode(initMode);
    const { tagDirList } = await runAsyncRequestTagDirList();

    if (initId) {
      setId(initId);

      const tagDetailFromBackend = await runAsyncRequestTagDetail(initId);
      setFieldValue(tagDetailFromBackend);
      form.setFieldsValue(
        convertFieldsValueToFrontendFormat(tagDetailFromBackend, {
          tagDirList,
        }),
      );
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

    const extract = [...fieldsValue.is_extract_show];
    if (extract.indexOf(0) > -1) {
      fieldsValue.is_extract_show = 1;
    } else {
      fieldsValue.is_extract_show = 0;
    }
    if (extract.indexOf(1) > -1) {
      fieldsValue.is_download_show = 1;
    } else {
      fieldsValue.is_download_show = 0;
    }
    const juseShowDetail = ['created_at', 'coverage', 'tag_id', 'updated_at', 'accuracy'];
    for (let i = 0; i < juseShowDetail.length; i++) {
      delete fieldsValue[`${juseShowDetail[i]}`];
    }
    if (mode === 'edit') {
      fieldsValue.tag_dir_father_id = fieldsValue.tag_dir_id;
      delete fieldsValue.tag_dir_id;
    }
    const funcMap = {
      create: runRequestAddTag,
      edit: runRequestEditTag,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    funcMap[mode](convertFieldsValueToBackendFormat(fieldsValue, { mode, tagId: id }));
  });

  return {
    mode,
    form,
    handleSubmit,
    submitLoading: !!requestAddTagLoading || !!requestEditTagLoading,
    tagDetailLoading,
    tagDirList,
    tagDirListLoading,
    fieldValue,
  };
}
