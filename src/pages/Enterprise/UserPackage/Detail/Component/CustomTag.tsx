/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Tree, Popover, Card, Button, Spin, message, Tag } from 'antd';
import { filter, reduce, isEmpty, map, get, chain, forEach, find, includes, some } from 'lodash';
import styles from '../../../base/styles.module.css';
import { RightSquareTwoTone, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { TagTipsTitle, TagTipsContent } from '../../../Common/Components/TagDirSelector/TagTips';
import tagDirSelectorStyles from '../../../Common/Components/TagDirSelector/styles.module.css';
import { getTagDirList, editUserPackageTask } from 'services/enterprise';

function filterTagListForExtract(originTagList: any) {
  return filter(originTagList, (tag) => tag.status === 'ONLINE' && tag.is_extract_show === 1);
}

const TREE_PROPS_FIELD_NAMES = {
  title: 'dirName',
  key: 'dirId',
  children: 'do_not_show_children',
};

function getTagDirListAndTagMetaList(tagDirList: any, setAllTagDirList: any) {
  const originTagDirList: any = [];
  for (let i = 0; i < tagDirList.length; i++) {
    const item = tagDirList[i];
    const itemTagList = item.tag_list;
    if (itemTagList.length <= 1) {
      originTagDirList.push(item);
    } else {
      for (let j = 0; j < itemTagList.length; j++) {
        const itemCopy = {
          ...item,
          tag_dir_id: parseFloat(`${item.tag_dir_id}.${itemTagList[j].tag_id}`),
          dir_name: `${item.dir_name} - ${itemTagList[j].tag_name}`,
          tag_list: [itemTagList[j]],
        };
        originTagDirList.push(itemCopy);
      }
    }
  }
  setAllTagDirList(originTagDirList);
  const firstLevelDirList = filter(originTagDirList, { dir_level: 1 });
  return reduce(
    firstLevelDirList,
    (result, { dir_name: firstLevelDirName, tag_dir_id: firstLevelDirId }) => {
      const firstLevelDirChildren = filter(
        originTagDirList,
        ({ dir_level: dirLevel, father_id: fatherId, tag_list: originTagList }) => {
          const tagList = filterTagListForExtract(originTagList);
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
        children: map(
          firstLevelDirChildren,
          ({ tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: originTagList }) => ({
            dirId: secondLevelDirId,
            dirName: secondLevelDirName,
            tagId: get(originTagList, '0.tag_id'),
            relateTag: filterTagListForExtract(originTagList)
              // eslint-disable-next-line camelcase
              .map(({ tag_en_name }) => tag_en_name)
              .join('|'),
          }),
        ),
      });
      forEach(firstLevelDirChildren, (secondLevelDir) => {
        const { tag_list: originTagList, dir_name: secondLevelDirName } = secondLevelDir;
        const tagList = filterTagListForExtract(originTagList);
        forEach(tagList, (tag) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result.tagMetaList.push({
            tagId: tag.tag_id,
            fieldName: tag.tag_en_name,
            fieldCnName: tag.tag_name,
            dataType: tag.field_type,
            ...tag,
          });
        });
        if (tagList?.length > 1) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result.tagMetaList.push({
            tagId: tagList.map((item) => item.tag_id).join('|'),
            // eslint-disable-next-line camelcase
            fieldName: tagList.map(({ tag_en_name }) => tag_en_name).join('|'),
            fieldCnName: secondLevelDirName,
            dataType: 'CASCADER',
          });
        }
      });
      return result;
    },
    { tagDirList: [], tagMetaList: [] },
  );
}

function useCustomArea(dataType: string, detailData: any = {}) {
  const { show_detail = [] } = detailData;
  const [tagMetaList, setTagMetaList] = useState<any>([]);
  const [tagDirList, setTagDirList] = useState<any>([]);
  const [filterTagDirList, setFilterTagDirList] = useState<any>([]);
  const [tagSecondMetaList, setSecondMetaList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectTag, setSelectTag] = useState<any>([]);
  const [allTagDirList, setAllTagDirList] = useState([]);
  const [firstLevelSelectedKeys, setFirstLevelSelectedKeys] = useState<any>();
  const filter = (searchKeyword: string) => {
    setLoading(true);
    if (searchKeyword === '' || searchKeyword === undefined) {
      setFilterTagDirList(tagDirList);
      setSecondMetaList(
        // @ts-ignore
        get(find(tagDirList, { dirId: firstLevelSelectedKeys[0] }), 'children'),
      );
      setLoading(false);
      return;
    }
    const filter = reduce(
      tagDirList,
      (result, firstLevelDir) => {
        const { dirId: firstLevelDirId, dirName: firstLevelDirName, children: secondLevelDirList } = firstLevelDir;
        if (includes(firstLevelDirName, searchKeyword)) {
          // @ts-ignore
          result.push(firstLevelDir);
        } else if (
          some(secondLevelDirList, ({ dirName: secondLevelDirName }) => includes(secondLevelDirName, searchKeyword))
        ) {
          // @ts-ignore
          result.push({
            dirId: firstLevelDirId,
            dirName: firstLevelDirName,
            // @ts-ignore
            children: filter(secondLevelDirList, ({ dirName: secondLevelDirName }: { dirName: string }) =>
              includes(secondLevelDirName, searchKeyword),
            ),
          });
        }
        return result;
      },
      [],
    );
    setFilterTagDirList(filter);
    setSecondMetaList(get(filter, '0.children'));
    setFirstLevelSelectedKeys([get(filter, '0.dirId')]);
    setLoading(false);
  };
  const fetchData = async (setTagMetaList: any) => {
    setLoading(true);
    const [res, err] = await getTagDirList({
      tag_group: dataType === 'uin' ? 'INNER' : 'OUTER',
    });
    if (err) {
      message.error(err.message);
      return;
    }
    if (res) {
      if (isEmpty(res?.tag_dir_list)) {
        throw new Error('获取标签分类列表为空，请联系管理员');
      }
      const originTagDirList = res.tag_dir_list;
      const tagdl = getTagDirListAndTagMetaList(originTagDirList, setAllTagDirList);
      const { tagDirList, tagMetaList } = tagdl;
      setTagMetaList(tagMetaList);
      setTagDirList(tagDirList);
      setFilterTagDirList(tagDirList);
      setSecondMetaList(get(tagDirList, '0.children'));
      setFirstLevelSelectedKeys([get(tagDirList, '0.dirId')]);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData(setTagMetaList);
  }, [dataType]);
  useEffect(() => {
    const initSelectTag = [];
    if (show_detail.length > 0 && allTagDirList.length > 0) {
      for (let i = 0; i < show_detail.length; i++) {
        const tagId = show_detail[i]?.tag_id;
        for (let j = 0; j < allTagDirList.length; j++) {
          const tagDir = allTagDirList[j];
          if (tagId === get(tagDir, 'tag_list.0.tag_id')) {
            const { tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: originTagList } = tagDir;
            initSelectTag.push({
              dirId: secondLevelDirId,
              dirName: secondLevelDirName,
              tagId: get(originTagList, '0.tag_id'),
              relateTag: filterTagListForExtract(originTagList)
                .map(({ tag_en_name }) => tag_en_name)
                .join('|'),
            });
            break;
          }
        }
      }
      setSelectTag(initSelectTag);
    }
  }, [show_detail, allTagDirList]);
  return {
    filter,
    loading,
    filterTagDirList,
    setSecondMetaList,
    setFirstLevelSelectedKeys,
    firstLevelSelectedKeys,
    tagSecondMetaList,
    selectTag,
    setSelectTag,
    tagMetaList,
  };
}

export function CustomTag(props: any) {
  const { dataType = 'uin', taskId, detailTask } = props;
  // 如需增加搜索标签功能，直接放开filter和下面的搜索框即可
  const {
    // filter,
    loading,
    filterTagDirList,
    setSecondMetaList,
    setFirstLevelSelectedKeys,
    firstLevelSelectedKeys,
    tagSecondMetaList,
    selectTag,
    setSelectTag,
    tagMetaList,
  } = useCustomArea(dataType, detailTask);

  return (
    <Card
      title={
        <>
          <span>配置下发标签</span>
          <span style={{ marginLeft: '10px', fontSize: '11px', color: 'gray' }}>
            配置分群的企业或用户标签信息下发到下游
          </span>
        </>
      }
      style={{ marginTop: '20px' }}
    >
      <div className={styles['tag-dir-selector']} style={{ float: 'left' }}>
        {/* <div className={styles['tag-dir-selector__keyword-search']}>
          <Input.Search
            placeholder="请输入标签名称或关键字回车搜索"
            onSearch={(v) => {
              filter(v)
            }}
            style={{ width: '365px' }}
            enterButton
          />
        </div> */}
        <Spin spinning={loading}>
          <div className={styles['tag-dir-selector__dir-selector-container']}>
            <div>
              <div className={styles['tag-dir-selector__dir-selector-header']}>
                <span style={{ fontSize: 14 }}>标签分类</span>
              </div>

              <div className={styles['tag-dir-selector__dir-selector']} style={{ width: 160 }}>
                <Tree
                  fieldNames={TREE_PROPS_FIELD_NAMES}
                  treeData={filterTagDirList}
                  onSelect={(v) => {
                    setSecondMetaList(get(find(filterTagDirList, { dirId: v[0] }), 'children'));
                    setFirstLevelSelectedKeys(v);
                  }}
                  selectedKeys={firstLevelSelectedKeys}
                />
              </div>
            </div>
            <div className={styles['tag-dir-selecotr__seperator']}>
              <RightSquareTwoTone style={{ fontSize: 24 }} />
            </div>
            <div>
              <div className={styles['tag-dir-selector__dir-selector-header']}>
                <span>标签</span>
              </div>
              <div className={styles['tag-dir-selector__dir-selector']} style={{ width: 220 }}>
                <div
                  style={{
                    padding: '0px 0 0 16px',
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
                  {map(tagSecondMetaList, (tagDir, index) => (
                    <div
                      key={index}
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
                        }}
                        onClick={() => {
                          if (selectTag.indexOf(tagDir) < 0) {
                            setSelectTag([...selectTag, tagDir]);
                          } else {
                            message.info('标签已被选取');
                          }
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
                            paddingRight: '10px',
                          }}
                        />
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles['tag-dir-selecotr__seperator']}>
              <RightSquareTwoTone style={{ fontSize: 24 }} />
            </div>
            <div>
              <div className={styles['tag-dir-selector__dir-selector-header']}>
                <span>已选字段:{selectTag.length}个</span>
                <Button
                  type='link'
                  icon={<DeleteOutlined />}
                  style={{ color: '#ff4d4f', height: '17px' }}
                  className={styles['btn-delete']}
                  onClick={() => {
                    setSelectTag([]);
                  }}
                />
              </div>
              <div className={styles['tag-dir-selector__dir-selector']} style={{ width: 400 }}>
                <div
                  style={{
                    padding: '0px 0 0 16px',
                    color: 'rgba(0, 0, 0, 0.85)',
                  }}
                >
                  {map(selectTag, (tag) => {
                    const tagKey = get(tag, 'dirId');
                    const tagLabel = get(tag, 'dirName');
                    return (
                      <Tag
                        key={tagKey}
                        closable
                        className={styles['tag-item']}
                        style={{ marginBottom: '5px', fontSize: '13px' }}
                        onClose={() => {
                          const filter = selectTag.filter((item: any) => item.dirId !== tag.dirId);
                          setSelectTag(filter);
                        }}
                      >
                        {tagLabel}
                      </Tag>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <div style={{ float: 'right', width: '110px' }}>
        <div style={{ position: 'absolute', bottom: '24px' }}>
          <Button
            disabled={selectTag.length === 0}
            onClick={async () => {
              const [res, err] = await editUserPackageTask({
                task_id: taskId,
                show_detail: selectTag.map((item: any) => ({ tag_id: item.tagId })),
              });
              if (res) {
                message.success('配置下发标签成功');
              } else {
                message.error(get(err, 'message') || '配置下发标签失败');
              }
            }}
            style={{ marginTop: '5px' }}
            type='primary'
          >
            保存标签
          </Button>
        </div>
      </div>
    </Card>
  );
}

CustomTag.displayName = 'CustomTag';
