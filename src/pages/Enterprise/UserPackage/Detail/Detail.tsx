import React from 'react';
// import { getUrlSearchParams } from '../../Common/util';
import { get } from 'lodash';
import { useStore } from 'store';
import { useParams } from 'react-router-dom';
// import { useSafeState } from 'ahooks';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { UserPackageDetail } from './Component/UserPackageDetail';

function DetailContainer() {
  // const location = useLocation();
  const params: any = useParams();
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  // const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const taskId = +get(params, 'id');

  if (!panshiAuthMap?.enterprisePackageManage?.pageAuth) {
    return <AuthAlert />;
  }

  return (
    <AdminContentLayout title='分群详情' backUrl={`/enterprise/user_package_list/list`}>
      <UserPackageDetail common={{ panshiAuthMap }} taskId={taskId} />
    </AdminContentLayout>
  );
}
export default DetailContainer;
