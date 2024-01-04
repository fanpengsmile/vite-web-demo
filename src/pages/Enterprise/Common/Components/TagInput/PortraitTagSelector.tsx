import { isFunction, isEmpty, last, filter, reduce, map, forEach } from 'lodash';
import { Cascader, Spin, message } from 'antd';
import { useRequest, useMemoizedFn } from 'ahooks';
import { showErrCodeMsg } from '../../../base/cgi';
import { getTagDirList } from 'services/enterprise';
import React from 'react';

export function PortraitTagSelector({
  tagMetaList = [],
  options = [],
  width = 300,
  value,
  onChange,
  onSelectedTagsChange,
  disabled = false,
  allowClear = false,
  multiple = false,
  loading = false,
}: any) {
  const handleChange = useMemoizedFn((newValue) => {
    // eslint-disable-next-line no-unused-expressions
    isFunction(onChange) && onChange(newValue);
    // eslint-disable-next-line no-unused-expressions
    isFunction(onSelectedTagsChange) &&
      !isEmpty(tagMetaList) &&
      onSelectedTagsChange(
        newValue.map((tagIdArr: Array<any>) => {
          return tagMetaList.find((tagMeta: { tagId: number }) => tagMeta.tagId === tagIdArr[tagIdArr.length - 1]);
        }),
      );
  });

  return (
    <Spin spinning={loading}>
      <Cascader
        style={{ width }}
        options={options}
        onChange={handleChange}
        value={value}
        disabled={disabled}
        allowClear={allowClear}
        multiple={multiple}
        showSearch
        displayRender={(label) => last(label)}
        showCheckedStrategy={Cascader.SHOW_CHILD}
      />
    </Spin>
  );
}
PortraitTagSelector.displayName = 'PortraitTagSelector';

/* 标签目录列表查询：https://opc-mock.woa.com/project/553/interface/api/4993 */
export function useTagDirList({
  onSuccess,
  manual = false,
  ignoreNotExtractShowTag = false,
  ignoreMultiValueTag = false,
  dataType = 'uin',
  filterForDownload = false,
}: any) {
  function getTagDirListAndTagMetaList(originTagDirList: any) {
    const firstLevelDirList = filter(originTagDirList, { dir_level: 1 });
    return reduce(
      firstLevelDirList,
      (result, { dir_name: firstLevelDirName, tag_dir_id: firstLevelDirId }) => {
        const firstLevelDirChildren = filter(
          originTagDirList,
          ({ dir_level: dirLevel, father_id: fatherId, tag_list: originTagList }) => {
            // eslint-disable-next-line no-use-before-define
            const tagList = filterTagList(originTagList);
            return dirLevel === 2 && fatherId === firstLevelDirId && !isEmpty(tagList);
          },
        );

        if (isEmpty(firstLevelDirChildren)) {
          return result;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.tagDirList.push({
          dirId: firstLevelDirId,
          dirName: firstLevelDirName,
          value: firstLevelDirId,
          label: firstLevelDirName,
          children: map(
            firstLevelDirChildren,
            ({ tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: tagList }) => ({
              dirId: secondLevelDirId,
              dirName: secondLevelDirName,
              value: secondLevelDirId,
              label: secondLevelDirName,
              // eslint-disable-next-line no-use-before-define
              children: map(filterTagList(tagList), ({ tag_id: tagId, tag_name: tagName }) => ({
                tagId,
                tagName,
                value: tagId,
                label: tagName,
              })),
            }),
          ),
        });
        forEach(firstLevelDirChildren, (secondLevelDir) => {
          const { tag_list: tagList, tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName } = secondLevelDir;
          // eslint-disable-next-line no-use-before-define
          forEach(filterTagList(tagList), (tag) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result.tagMetaList.push({
              ...tag,
              tagId: tag.tag_id,
              tagName: tag.tag_name,
              firstLevelDirId,
              firstLevelDirName,
              secondLevelDirId,
              secondLevelDirName,
            });
          });
        });
        return result;
      },
      { tagDirList: [], tagMetaList: [] },
    );
  }

  function filterTagList(originTagList: any) {
    return filter(originTagList, (tag) => {
      if (tag.status !== 'ONLINE') return false;
      if (ignoreNotExtractShowTag && tag.is_extract_show !== 1) return false;
      if (ignoreMultiValueTag && tag.is_multi_value === 1) return false;
      if (filterForDownload && tag.is_download_show !== 1) return false;

      return true;
    });
  }
  const {
    data,
    loading: tagDirListLoading,
    runAsync: runAsyncRequestTagDirList,
  } = useRequest(
    async () => {
      const [res, err] = await getTagDirList({
        tag_group: dataType === 'uin' ? 'INNER' : 'OUTER',
      });
      if (err) {
        message.error(err.message);
        return;
      }
      if (res) {
        const originTagDirList = res.tag_dir_list;

        const { tagDirList, tagMetaList } = getTagDirListAndTagMetaList(originTagDirList);
        // eslint-disable-next-line consistent-return
        return {
          tagDirList,
          tagMetaList,
        };
      }
      throw res;
    },
    {
      manual,
      onSuccess,
      onError(e) {
        showErrCodeMsg('获取标签分类列表失败', e);
      },
    },
  );

  return {
    ...data,
    tagDirListLoading,
    runAsyncRequestTagDirList,
  };
}
