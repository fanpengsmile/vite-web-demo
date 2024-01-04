import React from 'react';
import { Card, Descriptions, Spin } from 'antd';
import { getLabelFromOptionList } from '../../../Common/util';
import { taskTypeOptions } from '../../config';
import { isEmpty } from 'lodash';

export const BasicInfoCard = ({ userPackageTaskDetail, getUserPackageTaskDetailLoading }: any) => {
  return (
    <Card title='分群基本信息' className='mb15'>
      {getUserPackageTaskDetailLoading && <Spin spinning={!!getUserPackageTaskDetailLoading} />}
      {!isEmpty(userPackageTaskDetail) && (
        <Descriptions column={3}>
          <Descriptions.Item label='分群ID'>{userPackageTaskDetail?.task_id}</Descriptions.Item>
          <Descriptions.Item label='分群名称'>{userPackageTaskDetail?.task_name}</Descriptions.Item>
          <Descriptions.Item label='分群规模'>{userPackageTaskDetail?.match_uin_cnt}</Descriptions.Item>
          <Descriptions.Item label='创建人'>{userPackageTaskDetail?.creator}</Descriptions.Item>
          <Descriptions.Item label='创建时间'>{userPackageTaskDetail?.created_at}</Descriptions.Item>
          <Descriptions.Item label='创建方式'>
            {getLabelFromOptionList(taskTypeOptions, userPackageTaskDetail?.task_type)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};
BasicInfoCard.displayName = 'BasicInfoCard';
