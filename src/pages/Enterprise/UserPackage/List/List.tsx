import React from 'react';
import { usePvReport } from '../../Common/util';
import { useStore } from 'store';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { UserPackageList } from './Component/UserPackageList';

function ListContainer(props: any) {
  const { meta } = props;
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const location = useLocation();
  const env = import.meta.env.MODE === 'Production' ? 'online' : 'dev';

  usePvReport(meta, location.pathname);

  if (!get(panshiAuthMap, 'enterprisePackageManage.pageAuth')) {
    return <AuthAlert />;
  }

  const packageListIssue = get(panshiAuthMap, 'enterprisePackageManage.packageListIssue');

  return (
    <AdminContentLayout title='分群管理'>
      <UserPackageList {...props} common={{ panshiAuthMap, env }} packageListIssue={packageListIssue} />
    </AdminContentLayout>
  );
}

export default ListContainer;
