import React, { useState, useEffect } from 'react';
import { Input, Tree, Popover, Card, Checkbox, Button, Spin, message, Tooltip, Tag } from 'antd';
import { getTagDirList } from 'services/enterprise';
import { filter, reduce, isEmpty, map, get, forEach, find, includes, some } from 'lodash';
import styles from '../../../base/styles.module.css';
import { RightSquareTwoTone, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { TagTipsTitle, TagTipsContent } from '../../../Common/Components/TagDirSelector/TagTips';
import tagDirSelectorStyles from '../../../Common/Components/TagDirSelector/styles.module.css';

function filterTagListForExtract(originTagList: any) {
  return filter(originTagList, (tag) => tag.status === 'ONLINE' && tag.is_extract_show === 1);
}

const TREE_PROPS_FIELD_NAMES = {
  title: 'dirName',
  key: 'dirId',
  children: 'do_not_show_children',
};

function getTagDirListAndTagMetaList(tagDirList: any) {
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
          // firstLevelDirChildren,
          firstLevelDirChildren.filter((item) => get(item, 'tag_list.0.is_insight_show') === 1),
          ({ tag_dir_id: secondLevelDirId, dir_name: secondLevelDirName, tag_list: originTagList }) => ({
            dirId: secondLevelDirId,
            dirName: secondLevelDirName,
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
            // eslint-disable-next-line camelcase
            tagId: tagList.map(({ tag_id }) => tag_id).join('|'),
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

function useCustomArea(setTagMetaList: any, dataType: string) {
  const [tagDirList, setTagDirList] = useState([]);
  const [filterTagDirList, setFilterTagDirList] = useState([]);
  const [tagSecondMetaList, setSecondMetaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectTag, setSelectTag] = useState([]);
  const [showTgi, setShowTgi] = useState(false);
  const [firstLevelSelectedKeys, setFirstLevelSelectedKeys] = useState();
  const filter = (searchKeyword: string) => {
    setLoading(true);
    if (searchKeyword === '' || searchKeyword === undefined) {
      setFilterTagDirList(tagDirList);
      setSecondMetaList(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        get(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          find(tagDirList, { dirId: firstLevelSelectedKeys[0] }),
          'children',
        ),
      );
      setLoading(false);
      return;
    }
    const filter = reduce(
      tagDirList,
      (result, firstLevelDir) => {
        const { dirId: firstLevelDirId, dirName: firstLevelDirName, children: secondLevelDirList } = firstLevelDir;
        if (includes(firstLevelDirName, searchKeyword)) {
          result.push(firstLevelDir);
        } else if (
          some(secondLevelDirList, ({ dirName: secondLevelDirName }) => includes(secondLevelDirName, searchKeyword))
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result.push({
            dirId: firstLevelDirId,
            dirName: firstLevelDirName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSecondMetaList(get(filter, '0.children'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      const tagdl = getTagDirListAndTagMetaList(originTagDirList);
      const { tagDirList, tagMetaList } = tagdl;
      setTagMetaList(tagMetaList);
      setTagDirList(tagDirList);
      setFilterTagDirList(tagDirList);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSecondMetaList(get(tagDirList, '0.children'));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFirstLevelSelectedKeys([get(tagDirList, '0.dirId')]);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData(setTagMetaList);
  }, [dataType]);
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
    showTgi,
    setShowTgi,
  };
}

export function CustomArea(props: any) {
  const { fetchChartData, tagMetaList, setTagMetaList, detailData, dataType = 'uin' } = props;
  const {
    filter,
    loading,
    filterTagDirList,
    setSecondMetaList,
    setFirstLevelSelectedKeys,
    firstLevelSelectedKeys,
    tagSecondMetaList,
    selectTag,
    setSelectTag,
    showTgi,
    setShowTgi,
  } = useCustomArea(setTagMetaList, dataType);

  useEffect(() => {
    if (detailData && get(detailData, 'layout')) {
      let layout = {};
      try {
        layout = JSON.parse(get(detailData, 'layout'));
      } catch (error) {
        message.error('保存报告数据有误');
      }
      const tags = get(layout, 'tags', []);
      setSelectTag(tags);
      const tgival = get(layout, 'showTgi') || false;
      setShowTgi(tgival);
      if (tags.length > 0) {
        fetchChartData(tags, tgival);
      }
    }
  }, [filterTagDirList]);

  return (
    <Card title='添加分析维度' style={{ marginTop: '20px' }}>
      <div className={styles['tag-dir-selector']} style={{ float: 'left' }}>
        <div className={styles['tag-dir-selector__keyword-search']}>
          <Input.Search
            placeholder='请输入标签名称或关键字回车搜索'
            onSearch={(v) => {
              filter(v);
            }}
            style={{ width: '365px' }}
            enterButton
          />
        </div>
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
                    setSecondMetaList(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      get(find(filterTagDirList, { dirId: v[0] }), 'children'),
                    );
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
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
                        {(tagDir as any).dirName}
                      </span>
                      <Popover
                        placement='topLeft'
                        content={
                          <TagTipsContent
                            tagMetaList={tagMetaList}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            relateTag={tagDir.relateTag}
                          />
                        }
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
                          const filter = selectTag.filter(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            (item) => item.dirId !== tag.dirId,
                          );
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
          <Checkbox
            checked={showTgi}
            onChange={(v) => {
              setShowTgi(v.target.checked);
            }}
          >
            <Tooltip
              title={
                <>
                  <p>TGI=（人群中标签覆盖占比/大盘用户中该标签用户占比） *100</p>
                  <p>
                    TGI代表人群包中某标签值在该标签下显著性特征结果。
                    高于100代表该人群对某类标签值的倾向/偏好高于大盘平均水平，
                    数值越大倾向/偏好越强；低于100代表相关倾向较弱（与平均水平相比）。
                  </p>
                </>
              }
            >
              是否显示TGI
              <InfoCircleOutlined style={{ fontSize: '12px', marginLeft: '1px' }} />
            </Tooltip>
          </Checkbox>
          <Button
            disabled={selectTag.length === 0}
            onClick={() => {
              fetchChartData(selectTag, showTgi, undefined, true);
            }}
            style={{ marginTop: '5px' }}
            type='primary'
          >
            开始分析画像
          </Button>
        </div>
      </div>
    </Card>
  );
}

CustomArea.displayName = 'CustomArea';
