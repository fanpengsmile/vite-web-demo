import React from 'react';
import { getUrlSearchParams } from '../../Common/util';
import { get } from 'lodash';
import { useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { useSafeState } from 'ahooks';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { DetailCustomerList } from './Component/DetailCustomerList';

function DetailCustomerListContainer() {
  const location = useLocation();
  const params: any = useParams();
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const id = +get(params, 'id');
  const sqlType = initUrlParams?.sql_type;
  const instanceId = +get(params, 'instanceId');
  const { dataType } = params;
  if (
    !panshiAuthMap?.enterprisePackageManage?.pageAuth ||
    !panshiAuthMap?.enterprisePackageManage?.availableForCheckPackageInstanceDetail
  ) {
    return <AuthAlert />;
  }

  return (
    <AdminContentLayout
      title='分群详情'
      backUrl={`/enterprise/user_package/${sqlType ? 'sql_import/' : ''}detail/${id}`}
      isUseBackUrl
    >
      <DetailCustomerList dataType={dataType} taskId={id} instanceId={instanceId} common={{ panshiAuthMap }} />
    </AdminContentLayout>
  );
}
export default DetailCustomerListContainer;
