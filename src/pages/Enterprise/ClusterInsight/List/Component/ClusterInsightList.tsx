import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, DatePicker, Input, Card, Button, Row, Col, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StaffSelect from 'components/StaffSelect';
import { ListTable } from './ListTable';
import { get } from 'lodash';
import { getInsightTaskList } from 'services/enterprise';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

function useInsightList() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    size: 'small',
  });
  const fetchData = async (filter?: any, pageInfo?: any) => {
    setLoading(true);
    let params = {
      page_index: pageInfo ? pageInfo.current : pagination.current,
      page_size: pageInfo ? pageInfo.pageSize : pagination.pageSize,
    };
    if (filter) {
      params = {
        ...params,
        ...filter,
      };
    }
    const [res, err] = await getInsightTaskList(params);
    if (err) {
      message.error(err.message);
      return;
    }
    setDataSource(get(res, 'insight_task_list', []));
    setPagination({
      ...(pageInfo || pagination),
      total: get(res, 'data.total'),
    });
    setLoading(false);
  };
  const [form] = Form.useForm();
  const submit = () => {
    const timeRange = form.getFieldValue('createTimeRange');
    const filter = {
      task_name: form.getFieldValue('task_name'),
      creator: form.getFieldValue('creator'),
      pkg_name: form.getFieldValue('pkg_name'),
      lower_created_at: timeRange && timeRange[0].format('YYYY-MM-DD HH:MM:SS'),
      upper_created_at: timeRange && timeRange[1].format('YYYY-MM-DD HH:MM:SS'),
    };
    fetchData(filter);
  };
  const reset = () => {
    form.setFieldsValue({
      task_name: undefined,
      creator: undefined,
      createTimeRange: undefined,
      pkg_name: undefined,
    });
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { loading, dataSource, form, reset, submit, pagination, setPagination, fetchData };
}

export function ClusterInsightList() {
  const { loading, dataSource, form, reset, submit, pagination, setPagination, fetchData } = useInsightList();

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={10}>
      <Card>
        <Form form={form} {...FORM_ITEM_LAYOUT} colon={false}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item style={{ marginBottom: '0' }} name='task_name' label='画像名称'>
                <Input placeholder='请输入画像名称' allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ marginBottom: '0' }} name='pkg_name' label='分群名称'>
                <Input placeholder='请输入分群名称' allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ marginBottom: '0' }} label='创建人' name='creator'>
                <StaffSelect placeholder='请输入任务责任人' clearable />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ marginBottom: '0' }} name='createTimeRange' label='创建时间'>
                <DatePicker.RangePicker format='YYYY-MM-DD' allowClear />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Button className='mr10' type='primary' onClick={submit}>
              查询
            </Button>
            <Button
              onClick={() => {
                reset();
              }}
            >
              重置
            </Button>
          </div>
        </Form>
      </Card>
      <Link style={{ color: 'white' }} to={`/enterprise/user_package/cluster_insight_create`}>
        <Button type='primary'>
          <PlusOutlined />
          新建分群画像
        </Button>
      </Link>

      <ListTable
        dataSource={dataSource}
        loading={loading}
        fetchData={fetchData}
        pagination={pagination}
        onchange={(v: any) => {
          setPagination(v);
          fetchData(undefined, v);
        }}
      />
    </Space>
  );
}
ClusterInsightList.displayName = 'ClusterInsightList';
