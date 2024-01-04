import React from 'react';
import { getUrlSearchParams, usePvReport } from '../../Common/util';
import { useSafeState } from 'ahooks';
import { useStore } from 'store';
import { get } from 'lodash';
import { useLocation, useParams } from 'react-router-dom';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import SQLUpload from './Component/SQLUpload';

const modeStrMap = {
  edit: '编辑',
  create: '创建',
  copy: '复制',
};

function SQLImport(props: any) {
  const { meta } = props;
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const staffname = useStore((state) => state.currentStaffName);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const location = useLocation();
  const params = useParams();
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const id = +get(params as any, 'id');
  const isCopy = initUrlParams?.isCopy;
  // eslint-disable-next-line no-nested-ternary
  const mode = id ? (isCopy ? 'copy' : 'edit') : 'create';
  const isDetail = location.pathname.indexOf('sql_import/detail') > -1;
  const modeStr = modeStrMap[mode];
  const title = `SQL导入${modeStr}分群`;

  usePvReport(meta, location.pathname);

  if (!get(panshiAuthMap, 'enterprisePackageManage.pageAuth')) {
    return <AuthAlert />;
  }
  return (
    <AdminContentLayout title={title} backUrl={`/enterprise/user_package_list/list`}>
      <SQLUpload
        id={id}
        mode={mode}
        isDetail={isDetail}
        common={{ panshiAuthMap }}
        staffname={staffname}
        modeStr={modeStrMap[mode === 'copy' ? 'create' : mode]}
        {...props}
      />
    </AdminContentLayout>
  );
}
export default SQLImport;
