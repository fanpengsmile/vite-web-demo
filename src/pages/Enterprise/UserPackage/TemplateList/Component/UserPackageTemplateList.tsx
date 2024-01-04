/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Space, message, Table, Popconfirm, Card } from 'antd';
import { get, map, find } from 'lodash';
import { getTemplateList, deleteTemplateList } from 'services/enterprise';
import { useTagDirList } from '../../../Common/Components/TagInput/PortraitTagSelector';
import { packageTemplateList, userIdTypeOptions } from '../../config';
import { TemplateDialog } from './TemplateDialog';
import { SearchForm } from './SearchForm';

function usePackageTemplate() {
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateValue, setTemplateValue] = useState({});
  const [showTemplateDialog, setShowTemplateDialog] = useState('');
  const [showTemplateValue, setShowTemplateValue] = useState([]);
  const [isDetail, setDetail] = useState(false);
  const fetchTemplateNameList = (isFilter?: boolean) => {
    setLoading(true);
    const params: any = {
      page_index: 1,
      page_size: 1000,
      template_type_list: ['tag_list', 'tag_extract', 'user_package'],
    };
    if (isFilter) {
      get(templateValue, 'create') && (params.creator = get(templateValue, 'create'));
      get(templateValue, 'type') && (params.template_type_list = [get(templateValue, 'type')]);
      get(templateValue, 'name') && (params.template_name = get(templateValue, 'name'));
    }
    getTemplateList(params)
      .then((res) => {
        const listName = get(res, '0.template_list', []);
        setTemplateList(listName);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const columns = [
    {
      dataIndex: 'template_name',
      title: '模版名称/ID',
      render: (v: string, r: any) => {
        const { template_id, template_para = '[]', template_name, owner_list, remark, template_type, data_type } = r;
        return (
          <>
            <a
              onClick={() => {
                setShowTemplateDialog(template_type);
                setDetail(true);
                setShowTemplateValue({
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  tag: map(JSON.parse(template_para), ({ tagId, firstLevelDirId, secondLevelDirId }) => [
                    firstLevelDirId,
                    secondLevelDirId,
                    tagId,
                  ]),
                  userPackageTem: JSON.parse(template_para),
                  name: template_name,
                  owner: owner_list,
                  remark,
                  type: template_type,
                  id: template_id,
                  dataType: data_type,
                });
              }}
              key='detail'
            >
              {v}
            </a>
            <p>{template_id}</p>
          </>
        );
      },
    },
    {
      dataIndex: 'template_type',
      title: '模版类型',
      render: (v: string) => {
        return get(find(packageTemplateList, { value: v }), 'label');
      },
    },
    { dataIndex: 'remark', title: '模版说明' },
    {
      dataIndex: 'data_type',
      title: 'ID类型',
      render: (v: string) => {
        return get(find(userIdTypeOptions, { value: v }), 'label');
      },
    },
    { dataIndex: 'owner_list', title: '关注人' },
    { dataIndex: 'creator', title: '创建人' },
    { dataIndex: 'created_at', title: '创建时间' },
    {
      dataIndex: 'detail',
      title: '操作',
      render: (v: string, r: any) => {
        const { template_id, template_para = '[]', template_name, owner_list, remark, template_type, data_type } = r;
        return [
          <Popconfirm
            key='del'
            title='删除模板？'
            onConfirm={() => {
              deleteTemplateList({
                template_id,
              })
                .then(() => {
                  message.success('删除模板成功');
                  fetchTemplateNameList();
                })
                .catch(() => {
                  message.error('删除模板失败');
                });
            }}
          >
            <a>删除</a>
          </Popconfirm>,
          <a
            onClick={() => {
              setShowTemplateDialog(template_type);
              setDetail(false);
              setShowTemplateValue({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tag: map(JSON.parse(template_para), ({ tagId, firstLevelDirId, secondLevelDirId }) => [
                  firstLevelDirId,
                  secondLevelDirId,
                  tagId,
                ]),
                name: template_name,
                owner: owner_list,
                remark,
                userPackageTem: JSON.parse(template_para),
                type: template_type,
                id: template_id,
                dataType: data_type,
              });
            }}
            style={{ marginLeft: '10px' }}
            key='edit'
          >
            编辑
          </a>,
        ];
      },
    },
  ];
  useEffect(() => {
    fetchTemplateNameList();
  }, []);
  return {
    templateList,
    loading,
    setTemplateValue,
    showTemplateDialog,
    setShowTemplateDialog,
    showTemplateValue,
    setShowTemplateValue,
    isDetail,
    templateValue,
    fetchTemplateNameList,
    columns,
  };
}

export function UserPackageTemplateList({ common }: any) {
  const {
    templateList,
    loading,
    setTemplateValue,
    showTemplateDialog,
    setShowTemplateDialog,
    showTemplateValue,
    setShowTemplateValue,
    isDetail,
    templateValue,
    fetchTemplateNameList,
    columns,
  } = usePackageTemplate();

  const { tagDirList, tagMetaList } = useTagDirList({
    ignoreNotExtractShowTag: false,
    ignoreMultiValueTag: true,
    filterForDownload: true,
    dataType: get(showTemplateValue, 'dataType'),
  });

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={10}>
      <Card>
        <SearchForm
          setTemplateValue={setTemplateValue}
          templateValue={templateValue}
          fetchTemplateNameList={fetchTemplateNameList}
        ></SearchForm>
      </Card>
      <Table dataSource={templateList} loading={loading} columns={columns} rowKey='template_id' />
      {showTemplateValue ? (
        <TemplateDialog
          setShowTemplateDialog={setShowTemplateDialog}
          showTemplateDialog={showTemplateDialog}
          isDetail={isDetail}
          showTemplateValue={showTemplateValue}
          tagMetaList={tagMetaList}
          fetchTemplateNameList={fetchTemplateNameList}
          setShowTemplateValue={setShowTemplateValue}
          tagDirList={tagDirList}
          common={common}
        ></TemplateDialog>
      ) : null}
    </Space>
  );
}
UserPackageTemplateList.displayName = 'UserPackageTemplateList';
