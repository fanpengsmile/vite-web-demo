import React from 'react';
import { ClusterInsightCreate } from './Component/ClusterInsightCreate';
import { usePvReport } from '../../Common/util';
import { get } from 'lodash';
import { useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { AdminContentLayout } from '../../Common/components';

function UserPackageClusterInsight(props: any) {
  const { meta } = props;
  const location = useLocation();
  const staffname = useStore((state) => state.currentStaffName);
  usePvReport(meta, location.pathname, {
    event_type: 'button',
  });
  const params = useParams();
  const taskId = +get(params as any, 'id');
  let mode = 'create';
  if (location.pathname.indexOf('cluster_insight_create') > -1) {
    mode = 'create';
  } else if (location.pathname.indexOf('cluster_insight_detail') > -1) {
    mode = 'detail';
  } else if (location.pathname.indexOf('cluster_insight_edit') > -1) {
    mode = 'edit';
  }
  return (
    <AdminContentLayout backUrl={`/enterprise/cluster_insight_list`} title='分群洞察创建'>
      <ClusterInsightCreate taskId={taskId} mode={mode} staffname={staffname}></ClusterInsightCreate>
    </AdminContentLayout>
  );
}

export default UserPackageClusterInsight;
