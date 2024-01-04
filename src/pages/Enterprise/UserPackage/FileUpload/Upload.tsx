import React from 'react';
import { useSafeState } from 'ahooks';
import { get } from 'lodash';
import { useLocation, useParams } from 'react-router-dom';
import { getUrlSearchParams, usePvReport } from '../../Common/util';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { useStore } from 'store';
import { UserPackageUpload } from './Component/UserPackageUpload';

const modeStrMap = {
  edit: '编辑',
  create: '创建',
  copy: '复制',
};

function UploadContainer(props: any) {
  const { meta } = props;
  const location = useLocation();
  const params = useParams();
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const id = +get(params as any, 'id');
  const isCopy = initUrlParams?.isCopy;
  // eslint-disable-next-line no-nested-ternary
  const mode = id ? (isCopy ? 'copy' : 'edit') : 'create';

  const modeStr = modeStrMap[mode];
  const title = `文件导入${modeStr}分群`;

  usePvReport(meta, location.pathname);
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  if (!get(panshiAuthMap, 'enterprisePackageManage.pageAuth')) {
    return <AuthAlert />;
  }

  return (
    <AdminContentLayout title={title} backUrl={`/enterprise/user_package_list/list`}>
      <UserPackageUpload
        id={id}
        mode={mode}
        common={{ panshiAuthMap }}
        modeStr={modeStrMap[mode === 'copy' ? 'create' : mode]}
        {...props}
      />
    </AdminContentLayout>
  );
}
export default UploadContainer;
