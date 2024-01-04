import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from 'store';
import { usePvReport } from '../Common/util';
import { AdminContentLayout, AuthAlert } from '../Common/components';
import OpportunityList from './Component/OpportunityList';
import { get } from 'lodash';

function ListContainer(props: any) {
  const { meta } = props;
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const location = useLocation();
  // const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  usePvReport(meta, location.pathname);

  if (!get(panshiAuthMap, 'enterpriseNationwideExtract.pageAuth')) {
    return <AuthAlert />;
  }

  return (
    <AdminContentLayout title='全国企业查询'>
      <OpportunityList {...initEnterpriseState} />
    </AdminContentLayout>
  );
}
ListContainer.displayName = 'ListContainer';

export default ListContainer;
