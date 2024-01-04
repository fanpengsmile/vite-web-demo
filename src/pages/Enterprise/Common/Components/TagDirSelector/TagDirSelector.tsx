import React, { useEffect } from 'react';
import { Tree, Input, Popover, Spin } from 'antd';
import { RightSquareTwoTone, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useSafeState, useMemoizedFn, useCreation } from 'ahooks';
import { find, isFunction, map, reduce, includes, some, filter, get, isNil } from 'lodash';
import styles from '../../../base/styles.module.css';
import tagDirSelectorStyles from './styles.module.css';
import { useTagDirList } from '../../../base/cgi';
import { TagTipsTitle, TagTipsContent } from './TagTips';

const TREE_PROPS_FIELD_NAMES = {
  title: 'dirName',
  key: 'dirId',
  children: 'do_not_show_children',
};

function TagSecondLevelDirSelector({ disabled, tagMetaList, tagDirList, onDirSelect }: any) {
  const disabledStyle = { color: 'rgba(0, 0, 0, 0.25)' };
  return (
    <div style={{ padding: '0px 0 0 16px', color: 'rgba(0, 0, 0, 0.85)' }}>
      {map(tagDirList, (tagDir) => (
        <div
          style={{
            marginBottom: 3,
            lineHeight: '24px',
            position: 'relative',
          }}
        >
          <span
            style={{
              marginRight: 3,
              cursor: 'pointer',
              ...(disabled ? disabledStyle : {}),
            }}
            onClick={() => {
              if (disabled) return;
              onDirSelect(tagDir.dirId);
            }}
          >
            {tagDir.dirName}
          </span>
          <Popover
            placement='topLeft'
            content={<TagTipsContent tagMetaList={tagMetaList} relateTag={tagDir.relateTag} />}
            title={<TagTipsTitle tagDir={tagDir} />}
            trigger='click'
            overlayClassName={tagDirSelectorStyles['tag-tips__popup']}
          >
            <InfoCircleOutlined
              style={{
                color: 'rgba(0,0,0,.35)',
                cursor: 'pointer',
                position: 'absolute',
                top: 7,
                right: 5,
              }}
            />
          </Popover>
        </div>
      ))}
    </div>
  );
  // return (
  //   <Tree
  //     disabled={disabled}
  //     fieldNames={{ ...TREE_PROPS_FIELD_NAMES, title: 'title' }}
  //     treeData={tagDirList}
  //     selectedKeys={[]}
  //     onSelect={onDirSelect}
  //   />
  // )
}

TagSecondLevelDirSelector.displayName = 'TagSecondLevelDirSelector';


function KeywordSearch({ disabled, onTagKeywordSearch }: any) {
  return (
    <Input.Search
      disabled={disabled}
      placeholder='请输入标签名称或关键字回车搜索'
      onSearch={onTagKeywordSearch}
      style={{ width: '100%' }}
      enterButton
    />
  );
}
KeywordSearch.displayName = 'KeywordSearch';

function TagFirstLevelDirSelector({ disabled, tagDirList, onDirSelect, firstLevelSelectedKeys }: any) {
  return (
    <Tree
      disabled={disabled}
      fieldNames={TREE_PROPS_FIELD_NAMES}
      treeData={tagDirList}
      onSelect={onDirSelect}
      selectedKeys={firstLevelSelectedKeys}
    />
  );
}
TagFirstLevelDirSelector.displayName = 'TagFirstLevelDirSelector';

export function TagDirSelector({
  tagMetaList,
  onTagKeywordSearch,
  filteredTagDirList,
  tagDirListLoading,
  firstLevelSelectedKeys,
  onFirstLevelDirSelect,
  displaySecondLevelDirList,
  onTagDirLeafClick,
  disabled,
}: any) {
  const onSecondLevelDirSelect = useMemoizedFn((selectedSecondLevelDirId) => {
    const secondLevelDirMeta = find(displaySecondLevelDirList, {
      dirId: selectedSecondLevelDirId,
    });
    // eslint-disable-next-line no-unused-expressions
    isFunction(onTagDirLeafClick) && onTagDirLeafClick(secondLevelDirMeta?.relateTag);
  });

  return (
    <div className={styles['tag-dir-selector']}>
      <div className={styles['tag-dir-selector__keyword-search']}>
        <KeywordSearch disabled={disabled} onTagKeywordSearch={onTagKeywordSearch} />
      </div>
      <div className={styles['tag-dir-selector__dir-selector-container']}>
        <div>
          <div className={styles['tag-dir-selector__dir-selector-header']}>
            <span style={{ fontSize: 14 }}>标签分类</span>
          </div>
          <Spin spinning={tagDirListLoading}>
            <div className={styles['tag-dir-selector__dir-selector']} style={{ width: 120 }}>
              <TagFirstLevelDirSelector
                disabled={disabled}
                tagDirList={filteredTagDirList}
                tagDirListLoading={tagDirListLoading}
                onDirSelect={onFirstLevelDirSelect}
                firstLevelSelectedKeys={firstLevelSelectedKeys}
              />
            </div>
          </Spin>
        </div>
        <div className={styles['tag-dir-selecotr__seperator']}>
          <RightSquareTwoTone style={{ fontSize: 24 }} />
        </div>
        <div>
          <div className={styles['tag-dir-selector__dir-selector-header']}>
            <span>标签</span>
          </div>
          <Spin spinning={tagDirListLoading}>
            <div className={styles['tag-dir-selector__dir-selector']} style={{ width: 200 }}>
              <TagSecondLevelDirSelector
                disabled={disabled}
                tagMetaList={tagMetaList}
                tagDirList={displaySecondLevelDirList}
                tagDirListLoading={tagDirListLoading}
                onDirSelect={onSecondLevelDirSelect}
              />
            </div>
          </Spin>
        </div>
        <div className={styles['tag-dir-selecotr__seperator']}>
          <RightSquareTwoTone style={{ fontSize: 24 }} />
        </div>
      </div>
    </div>
  );
}
TagDirSelector.displayName = 'TagDirSelector';

export function useTagDirSelector(dataType: string) {
  const [firstLevelSelectedKeys, setFirstLevelSelectedKeys] = useSafeState([]);
  const { tagDirList, tagMetaList, tagDirListLoading, getTagDirList } = useTagDirList(({ tagDirList }) => {
    const firstDirIdOfFirstLevelDir = tagDirList?.[0]?.dirId;
    // eslint-disable-next-line no-unused-expressions
    firstDirIdOfFirstLevelDir && setFirstLevelSelectedKeys([firstDirIdOfFirstLevelDir] as any);
  }, dataType);
  useEffect(() => {
    getTagDirList();
  }, [dataType]);
  const [searchKeyword, setSearchKeyword] = useSafeState('');
  const oneLevelDirTagList = useCreation(() => {
    return map(tagDirList, ({ dirName, dirId, children }) => {
      return {
        value: dirId,
        label: dirName,
        children: map(children, ({ dirName: secondLevelDirName, relateTag }) => {
          return {
            value: relateTag,
            label: secondLevelDirName,
          };
        }),
      };
    });
  }, [tagDirList]);
  const filteredTagDirList = useCreation(() => {
    const filter = reduce(
      tagDirList,
      (result: any, firstLevelDir) => {
        const { dirId: firstLevelDirId, dirName: firstLevelDirName, children: secondLevelDirList } = firstLevelDir;
        if (includes(firstLevelDirName, searchKeyword)) {
          result.push(firstLevelDir);
        } else if (
          some(secondLevelDirList, ({ dirName: secondLevelDirName }) => includes(secondLevelDirName, searchKeyword))
        ) {
          result.push({
            dirId: firstLevelDirId,
            dirName: firstLevelDirName,
            children: filter(secondLevelDirList, ({ dirName: secondLevelDirName }: { dirName: string }) =>
              includes(secondLevelDirName, searchKeyword),
            ),
          });
        }
        return result;
      },
      [],
    );
    // eslint-disable-next-line no-unused-expressions
    get(filter, '0.dirId') && setFirstLevelSelectedKeys([get(filter, '0.dirId')] as any);
    return filter;
  }, [searchKeyword, tagDirList]);

  const onTagKeywordSearch = useMemoizedFn((newKeyword) => {
    setSearchKeyword(newKeyword);
    setFirstLevelSelectedKeys([]);
  });

  const onFirstLevelDirSelect = setFirstLevelSelectedKeys;
  const displaySecondLevelDirList = useCreation(() => {
    const firstLevelSelectedDirId = firstLevelSelectedKeys?.[0];
    if (isNil(firstLevelSelectedDirId)) return [];
    return map(find(filteredTagDirList, { dirId: firstLevelSelectedDirId })?.children, (tagDir) => {
      tagDir.title = (
        <span>
          {tagDir.dirName} <QuestionCircleOutlined />
        </span>
      );
      return tagDir;
    });
  }, [firstLevelSelectedKeys?.[0], filteredTagDirList]);

  return {
    tagDirList,
    tagMetaList,
    tagDirListLoading,
    searchKeyword,
    onTagKeywordSearch,
    filteredTagDirList,
    firstLevelSelectedKeys,
    onFirstLevelDirSelect,
    displaySecondLevelDirList,
    oneLevelDirTagList,
  };
}
