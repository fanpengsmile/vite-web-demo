/**
 * 标签字典列表页
 *
 * @author: peytonfan
 */
import React from 'react';
import { useSafeState } from 'ahooks';
import { TagDictEdit } from './TagDictEdit';
import { useStore } from 'store';
import { getUrlSearchParams } from '../../Common/util';
import { get, includes, some } from 'lodash';
import { useParams } from 'react-router-dom';
import { AdminContentLayout, AuthAlert } from '../../Common/components';

const modeTitleMap = {
  create: '新增标签',
  edit: '编辑标签',
  detail: '查看标签',
};

function InnerTagDictEditContainer(props: any) {
  const { meta } = props;
  // eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-unused-vars
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const params = useParams();
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tagId = +params.tagId;
  const { mode } = meta;
  const tagGroup = params.tag_group;
  const panshiAuthListRequired = includes(['create', 'edit'], mode)
    ? ['portraitMeta.tagDictPageAuth', 'portraitMeta.tagDictEditAuth']
    : ['portraitMeta.tagDictPageAuth'];
  if (some(panshiAuthListRequired, (panshiAuthPointRequired) => !get(panshiAuthMap, panshiAuthPointRequired))) {
    return <AuthAlert />;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const title = modeTitleMap[mode];

  return (
    <AdminContentLayout title={title} backUrl={`/enterprise/portrait_meta/tag_dict/list`}>
      <TagDictEdit {...props} mode={mode} tagId={tagId} tagGroup={tagGroup} />
    </AdminContentLayout>
  );
}

export default InnerTagDictEditContainer;
