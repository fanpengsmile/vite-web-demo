import React from 'react';
import { getUrlSearchParams, usePvReport } from '../../Common/util';
import { get } from 'lodash';
import { useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { useSafeState } from 'ahooks';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { UserPackageEdit } from './UserPackageEdit';

const modeStrMap = {
  edit: '编辑',
  create: '创建',
  copy: '复制',
};

function EditContainer(props: any) {
  const { meta } = props;
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const location = useLocation();
  const params = useParams();
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const id = +get(params as any, 'id');
  const isCopy = initUrlParams?.isCopy;
  // eslint-disable-next-line no-nested-ternary
  const mode = id ? (isCopy ? 'copy' : 'edit') : 'create';

  const taskType = meta?.taskType ?? 'extract';
  const modeStr = modeStrMap[mode];
  const isImport = get(location, 'pathname', '').indexOf('pkg_import') > -1;
  const isUserPackage = get(location, 'pathname', '').indexOf('user_package') > -1 && !isImport;
  const title = isImport ? `分群交并差${modeStr}分群` : `标签圈选${modeStr}分群`;

  usePvReport(meta, location.pathname);

  if (!get(panshiAuthMap, 'enterprisePackageManage.pageAuth')) {
    return <AuthAlert />;
  }

  return (
    <AdminContentLayout title={title} backUrl={`/enterprise/user_package_list/list`}>
      <UserPackageEdit
        id={id}
        mode={mode}
        common={{ panshiAuthMap }}
        modeStr={modeStrMap[mode === 'copy' ? 'create' : mode]}
        {...props}
        taskTypeFromUrl={taskType}
        isUserPackage={isUserPackage}
      />
    </AdminContentLayout>
  );
}
export default EditContainer;
