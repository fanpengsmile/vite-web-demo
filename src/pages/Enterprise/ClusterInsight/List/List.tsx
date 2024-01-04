import React from 'react';
import { ClusterInsightList } from './Component/ClusterInsightList';
import { usePvReport } from '../../Common/util';
import { useLocation } from 'react-router-dom';
import { AdminContentLayout } from '../../Common/components';

function ListContainer(props: any) {
  const { meta } = props;
  const location = useLocation();
  usePvReport(meta, location.pathname, {
    event_type: 'button',
  });
  return (
    <AdminContentLayout title='分群洞察'>
      <ClusterInsightList {...props} />
    </AdminContentLayout>
  );
}

export default ListContainer;
