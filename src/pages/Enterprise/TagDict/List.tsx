import React from 'react';
// import { useSafeState } from 'ahooks'
import { TagDictList } from './TagDictList/TagDictList';
import { useStore } from 'store';
// import { getUrlSearchParams, usePvReport } from '../Common/util';
import { get } from 'lodash';
import { AdminContentLayout, AuthAlert } from '../Common/components';

function InnerTagDictListContainer() {
  // const [initUrlParams] = useSafeState(() => getUrlSearchParams(location))
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  if (!get(panshiAuthMap, 'portraitMeta.tagDictPageAuth')) {
    return <AuthAlert />;
  }
  return (
    <AdminContentLayout title='标签字典'>
      <TagDictList common={{ panshiAuthMap }} />
    </AdminContentLayout>
  );
}

export default InnerTagDictListContainer;
