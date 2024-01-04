import React from 'react';
import { Form, Card, Input, Select, Row, Col } from 'antd';
import { get, find, reduce } from 'lodash';
import { IS_EXTRACT_SHOW_OPTIONS, IS_EXTRACT_TYPE_OPTIONS, fieldTypeOptions, tagGroupOptions } from '../config';
// 为什么不复用创建的组件，因为UI展示相差太多，且展示类型不同
export function DetailForm({ detail, tagDirList }: any) {
  const extract = [];
  if (get(detail, 'is_extract_show') === 1) {
    extract.push(0);
  }
  if (get(detail, 'is_download_show') === 1) {
    extract.push(1);
  }
  return (
    <>
      <Card
        title={
          <>
            <span>{`${get(detail, 'tag_name')} / ${get(detail, 'tag_en_name')}`}</span>
            <span style={{ color: '#3da8f5', marginLeft: '10px' }}>{get(detail, 'security_level')}</span>
          </>
        }
        extra={
          <span style={{ color: '#3da8f5', marginLeft: '10px' }}>
            {get(detail, 'status') === 'ONLINE' ? '已上线' : '已下线'}
          </span>
        }
        className='mb15'
      >
        <Form layout='vertical'>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label='标签ID类型'>
                <Input
                  disabled
                  value={get(
                    find(tagGroupOptions, {
                      value: get(detail, 'tag_group'),
                    }),
                    'label',
                  )}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='标签分类'>
                <Input
                  disabled
                  value={reduce(
                    tagDirList,
                    (result, firstLevelDir) => {
                      const findResult = find(firstLevelDir.children, {
                        dirId: get(detail, 'tag_dir_id'),
                      });
                      if (findResult) {
                        return firstLevelDir.dirName;
                      }
                      return result;
                    },
                    0,
                  )}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='标签作用域'>
                <Select disabled options={IS_EXTRACT_SHOW_OPTIONS} value={extract}></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='提包标签来源'>
                <Input disabled value={get(detail, 'tag_type')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='源表名称'>
                <Input disabled value={get(detail, 'field_source')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='源表字段名'>
                <Input disabled value={get(detail, 'field_source_key')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='标签值类型'>
                <Input
                  disabled
                  value={get(
                    find(fieldTypeOptions, {
                      value: get(detail, 'field_type'),
                    }),
                    'label',
                  )}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='创建类型'>
                <Input
                  disabled
                  value={get(
                    find(IS_EXTRACT_TYPE_OPTIONS, {
                      value: get(detail, 'create_type'),
                    }),
                    'label',
                  )}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='创建时间'>
                <Input disabled value={get(detail, 'created_at')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='最新计算时间'>
                <Input disabled value={get(detail, 'updated_at')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='计算逻辑'>
                <Input.TextArea disabled value={get(detail, 'calc_base_line')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='标签说明'>
                <Input.TextArea disabled value={get(detail, 'tag_explain')} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title='标签质量' className='mb15'>
        <Form layout='vertical'>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label='全量企业覆盖率'>
                <Input disabled value={get(detail, 'ent_coverage')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='所在表覆盖率'>
                <Input disabled value={get(detail, 'table_coverage')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='标签覆盖企业数'>
                <Input disabled value={get(detail, 'table_ent_num')}></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='准确率'>
                <Input disabled value={get(detail, 'accuracy')}></Input>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
DetailForm.displayName = 'DetailForm';
