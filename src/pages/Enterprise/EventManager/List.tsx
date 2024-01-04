import React from 'react';
import { useStore } from 'store';
import { get } from 'lodash';
import { AdminContentLayout, AuthAlert } from '../Common/components';
import { EventManageList } from './List/EventManageList';

function InnerEventManageListContainer(props: any) {
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  if (!get(panshiAuthMap, 'portraitMeta.eventManagePageAuth')) {
    return <AuthAlert />;
  }
  return (
    <AdminContentLayout title='数据源管理'>
      <EventManageList common={{ panshiAuthMap }} {...props} />
    </AdminContentLayout>
  );
}

export default InnerEventManageListContainer;
