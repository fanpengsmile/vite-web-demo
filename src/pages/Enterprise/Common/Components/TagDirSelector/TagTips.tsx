import { Typography, Tabs, Descriptions, Tag } from 'antd';
import React from 'react';
import { split, find, map, toString, take, get, isEmpty } from 'lodash';
import { useTagAvailableValueOptionList } from '../../../base/cgi';

const fieldTypeOptions = [
  { label: '字符串类型', value: 'STRING' },
  { label: '日期类型', value: 'DATE' },
  { label: '布尔类型', value: 'BOOL' },
  { label: '数值类型', value: 'DOUBLE' },
];

const tagTypeOptions = [
  { label: '属性类', value: 'property' },
  { label: '挖掘类', value: 'Mining' },
  { label: '统计类', value: 'static' },
];

function brhtml(v: string) {
  const snArray = v.split('\n');
  let result = null;
  let str = null;
  if (snArray.length >= 2) {
    for (let i = 0; i < snArray.length; i++) {
      if (i === 0) {
        result = snArray[i];
      } else {
        result = (
          <span>
            {result}
            {<br></br>}
            {snArray[i]}
          </span>
        );
      }
    }
    str = <div>{result}</div>;
  } else {
    return v;
  }
  const html = <label title={v}>{str}</label>;
  return html;
}

function TagInfo({ tagMeta }: any) {
  const MAX_DISPLAY_TAG_COUNT = 15;
  const { tagAvailableValueOptionList } = useTagAvailableValueOptionList(
    tagMeta.fieldName,
    false,
    tagMeta.field_type === 'STRING',
  );

  const displayOptionList = take(tagAvailableValueOptionList, MAX_DISPLAY_TAG_COUNT);
  return (
    <div>
      <div style={{ display: 'inline-block', maxWidth: 300, verticalAlign: 'top' }}>
        <Descriptions size='small' column={1} labelStyle={{ color: '#1890ff' }}>
          <Descriptions.Item label='标签名称'>{tagMeta.tag_name}</Descriptions.Item>
          <Descriptions.Item label='标签字段名'>{tagMeta.tag_en_name}</Descriptions.Item>
          <Descriptions.Item label='标签值类型'>
            {get(find(fieldTypeOptions, { value: tagMeta.field_type }), 'label')}
          </Descriptions.Item>
          <Descriptions.Item label='标签类型'>
            {tagMeta.create_type ? get(find(tagTypeOptions, { value: tagMeta.create_type }), 'label') : '/'}
          </Descriptions.Item>
          <Descriptions.Item label='标签说明'>
            {tagMeta.tag_explain ? brhtml(tagMeta.tag_explain) : '/'}
          </Descriptions.Item>
          <Descriptions.Item label='计算逻辑'>
            {tagMeta.calc_base_line ? brhtml(tagMeta.calc_base_line) : '/'}
          </Descriptions.Item>
        </Descriptions>
      </div>
      {!isEmpty(displayOptionList) && (
        <div
          style={{
            display: 'inline-block',
            maxWidth: 350,
            overflow: 'auto',
            paddingLeft: 20,
            borderLeft: '1px solid #ddd',
            minHeight: 240,
            verticalAlign: 'top',
          }}
        >
          <div>
            {map(displayOptionList, ({ label }: { label: string }) => (
              <Tag style={{ marginBottom: 5 }}>{label}</Tag>
            ))}
            {tagAvailableValueOptionList?.length > MAX_DISPLAY_TAG_COUNT && (
              <Tag>+{tagAvailableValueOptionList.length - MAX_DISPLAY_TAG_COUNT}</Tag>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
TagInfo.displayName = 'TagInfo';

export function TagTipsTitle({ tagDir }: any) {
  const { dirName } = tagDir;
  return (
    <>
      <div>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: 10,
          }}
        >
          {dirName}
        </span>
        <Typography.Link
          target='_blank'
          href='/enterprise/portrait_meta/tag_dict/list'
          style={{ fontWeight: 'normal' }}
        >
          更多信息
        </Typography.Link>
      </div>
    </>
  );
}
TagTipsTitle.displayName = 'TagTipsTitle';

export function TagTipsContent({ tagMetaList, relateTag }: any) {
  if (!relateTag) return null;
  const relateTagEnNameList = split(relateTag, '|');
  if (relateTagEnNameList.length === 1) {
    const targetTagMeta = find(tagMetaList, {
      fieldName: relateTagEnNameList[0],
    });
    return (
      <div style={{ marginTop: 12 }}>
        <TagInfo tagMeta={targetTagMeta} />
      </div>
    );
  }

  // eslint-disable-next-line no-use-before-define
  const tabsItems = buildTabsItems(relateTagEnNameList, tagMetaList);

  return <Tabs defaultActiveKey='0' items={tabsItems} size='small' />;

  function buildTabsItems(relateTagEnNameList: any[], tagMetaList: any[]) {
    return map(relateTagEnNameList, (tagEnName, index) => {
      const targetTagMeta = find(tagMetaList, {
        fieldName: tagEnName,
      });

      return {
        label: targetTagMeta.fieldCnName,
        key: toString(index),
        children: <TagInfo tagMeta={targetTagMeta} />,
      };
    });
  }
}
TagTipsContent.displayName = 'TagTipsContent';
