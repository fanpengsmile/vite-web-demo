import React from 'react';
import { useStore } from 'store';
// import { getUrlSearchParams, usePvReport } from '../../Common/util';
import { get, includes, some } from 'lodash';
import { useParams } from 'react-router-dom';
import { AdminContentLayout, AuthAlert } from '../../Common/components';
import { EventManageEdit } from './EventManageEdit';

const modeTitleMap = {
  create: '新增数据源',
  edit: '编辑数据源',
  detail: '查看数据源',
};

function InnerEventManageEditContainer(props: any) {
  const { meta } = props;
  // const location = useLocation();
  // const [initUrlParams] = useSafeState(() => getUrlSearchParams(location))
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const curStaffName = useStore((state) => state.currentStaffName);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const eventId = +params.eventId;
  const { mode } = meta;
  const panshiAuthListRequired = includes(['create', 'edit'], mode)
    ? ['portraitMeta.eventManagePageAuth', 'portraitMeta.eventManageEditAuth']
    : ['portraitMeta.eventManagePageAuth'];
  if (some(panshiAuthListRequired, (panshiAuthPointRequired) => !get(panshiAuthMap, panshiAuthPointRequired))) {
    return <AuthAlert />;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const title = modeTitleMap[mode];

  return (
    <AdminContentLayout title={title} backUrl={`/enterprise/portrait_meta/event_manage/list}`}>
      <EventManageEdit {...props} mode={mode} common={{ staffname: curStaffName }} eventId={eventId} />
    </AdminContentLayout>
  );
}

export default InnerEventManageEditContainer;
