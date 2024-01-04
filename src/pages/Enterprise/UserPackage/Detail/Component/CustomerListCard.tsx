import React, { useState, useEffect } from 'react';
import { get, find, map, delay, isEmpty, filter, includes } from 'lodash';
import {
  Card,
  Select,
  Form,
  // Spin,
  Typography,
  Button,
  message,
  Input,
  Modal,
  Table,
} from 'antd';
import { useCreation, useMemoizedFn } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import {
  useRequestGetUserPackageTaskDetail,
  useRequestSavePortraitTag,
  useRequestGetUserPackageTaskInstances,
  useRequestGetUserPackageInstanceDetailDataList,
  useRequestStartUserPackageInstanceDetailDataExcelDownload,
} from '../../../base/cgi';
import { PortraitDrawer, usePortraitDrawer } from '../../../Opportunity/Component/ListDeatil/PortraitDrawer';
import { PortraitTagSelector, useTagDirList } from '../../../Common/Components/TagInput/PortraitTagSelector';
import { instanceDetailGlobalPortraitTagFieldNameInLayout, packageTemplateList } from '../../config';
import StaffSelect from 'components/StaffSelect';
import { getTemplateList, addTemplateList } from 'services/enterprise';

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export const CustomerListCard = ({
  tableProps,
  columns,
  runSearch,
  instanceOptions,
  // requestInstancesLoading,
  // requestInstanceDetailDataListLoading,
  form,
  portraitDrawerState,
  instanceId,
  handleSelectedTagsChange,
  availableForDownloadPackageInstanceDetailExtendField,
  handleBtnDownloadClick,
  requestStartDownloadLoading,
  handleBtnSaveTagClick,
  requestSaveTagLoading,
  tagDirList,
  tagDirListLoading,
  tagMetaList,
  selectedTags,
  selectedTemplateName,
  setSelectedTemplateName,
  setSelectedTags,
}: any) => {
  const [templateNameList, setTemplateNameList] = useState<any>([]);
  const [templateList, setTemplateList] = useState<any>([]);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const fetchTemplateNameList = () => {
    getTemplateList({
      page_index: 1,
      page_size: 1000,
      template_type_list: ['tag_list'],
    })
      .then((res) => {
        const selectOptions = [];
        const templateData = [];
        const listName = get(res, '0.template_list', []);
        for (let i = 0; i < listName.length; i++) {
          const id = get(listName[i], 'template_id', '');
          const name = get(listName[i], 'template_name', '');
          selectOptions.push({
            label: name,
            value: id,
          });
          templateData.push({
            key: id,
            value: JSON.parse(get(listName[i], 'template_para', '[]')),
          });
        }
        setTemplateNameList(selectOptions);
        setTemplateList(templateData);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchTemplateNameList();
  }, []);
  // const loading =
  //   !!requestInstancesLoading || !!requestInstanceDetailDataListLoading
  return (
    <>
      <Card title='客户列表'>
        <Form className='mb15' form={form} onValuesChange={runSearch} layout='inline' initialValues={{ instanceId }}>
          <Form.Item label='提取时间' name='instanceId'>
            <Select style={{ width: 200 }} options={instanceOptions} defaultValue={instanceId} />
          </Form.Item>
          <Form.Item label='自定义画像标签' name='portraitTagIdListArr'>
            <PortraitTagSelector
              loading={tagDirListLoading}
              tagMetaList={tagMetaList}
              options={tagDirList}
              allowClear
              multiple
              width={300}
              onSelectedTagsChange={handleSelectedTagsChange}
            />
          </Form.Item>
          <Form.Item label='选择标签模板'>
            <Select
              style={{ width: 200, marginRight: '10px', textAlign: 'left' }}
              placeholder='选择标签模板'
              allowClear
              value={selectedTemplateName}
              options={templateNameList}
              onChange={(v) => {
                setSelectedTemplateName(v);
                setSelectedTags(get(find(templateList, { key: v }), 'value', []));
                form.setFieldValue(
                  'portraitTagIdListArr',
                  map(
                    get(find(templateList, { key: v }), 'value', []),
                    ({ tagId, firstLevelDirId, secondLevelDirId }) => [firstLevelDirId, secondLevelDirId, tagId],
                  ),
                );
                delay(runSearch, 100);
              }}
            />
          </Form.Item>
        </Form>
        <div className='mb15' style={{ textAlign: 'right' }}>
          <Button
            type='primary'
            onClick={() => {
              setShowAddTemplateDialog(true);
              setTimeout(() => {
                form.setFieldValue('tem_type', 'tag_list');
              }, 100);
            }}
            className='mr10'
          >
            保存模板
          </Button>
          <Button type='primary' className='mr10' loading={requestSaveTagLoading} onClick={handleBtnSaveTagClick}>
            保存标签
          </Button>
          {availableForDownloadPackageInstanceDetailExtendField && (
            <Button type='primary' loading={requestStartDownloadLoading} onClick={handleBtnDownloadClick}>
              下载详情
            </Button>
          )}
        </div>
        <Table {...tableProps} columns={columns} row_key='name' scroll={{ x: 'max-content' }} />
        <Modal
          onCancel={() => setShowAddTemplateDialog(false)}
          open={showAddTemplateDialog}
          title='自定义标签保存为模板'
          onOk={async () => {
            const formFileds = await form.validateFields();
            if (!selectedTags || selectedTags.length < 1) {
              message.error('请选择自定义画像标签！');
              return;
            }
            addTemplateList({
              template_name: formFileds.tem_name,
              template_para: JSON.stringify(selectedTags),
              owner_list: formFileds.tem_owner,
              template_type: formFileds.tem_type,
              remark: formFileds.tem_desc,
            })
              .then(() => {
                message.success('模板添加成功');
                fetchTemplateNameList();
                setShowAddTemplateDialog(false);
              })
              .catch(() => {
                message.error('模板添加失败');
              });
          }}
        >
          <Form form={form} {...FORM_ITEM_LAYOUT} className='mb15'>
            <Form.Item label='模板名称' name='tem_name' rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder='请输入模板名称'></Input>
            </Form.Item>
            <Form.Item label='模板说明' name='tem_desc'>
              <Input placeholder='请输入模板说明'></Input>
            </Form.Item>
            <Form.Item label='模板类型' name='tem_type' rules={[{ required: true, message: '请选择模板类型' }]}>
              <Select
                style={{
                  width: '100%',
                  marginRight: '10px',
                  textAlign: 'left',
                }}
                disabled
                placeholder='请选择模板类型'
                allowClear
                value={selectedTemplateName}
                options={packageTemplateList}
              />
            </Form.Item>
            <Form.Item label='关注人' name='tem_owner'>
              <StaffSelect placeholder='请输入关注人企微' multiple />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <PortraitDrawer {...portraitDrawerState} />
    </>
  );
};
CustomerListCard.displayName = 'CustomerListCard';

export function useCustomerListCard({ taskId, instanceId, dataType }: any) {
  const [selectedTags, setSelectedTags] = useState<any>();
  const [selectedTemplateName, setSelectedTemplateName] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    tableProps,
    requestInstanceDetailDataListLoading,
    search: { submit: runSearch },
  } = useRequestGetUserPackageInstanceDetailDataList(form);
  const { runRequestGetUserPackageTaskDetailAsync } = useRequestGetUserPackageTaskDetail({
    taskId,
    manual: true,
  });
  const { tagDirList, tagDirListLoading, tagMetaList } = useTagDirList({
    ignoreNotExtractShowTag: false,
    ignoreMultiValueTag: true,
    filterForDownload: true,
    dataType,
    onSuccess: async ({ tagMetaList }: any) => {
      try {
        const taskDetail = await runRequestGetUserPackageTaskDetailAsync();
        if (taskDetail?.layout) {
          const portraitTag = JSON.parse(taskDetail.layout)?.[instanceDetailGlobalPortraitTagFieldNameInLayout];
          if (!isEmpty(portraitTag)) {
            const newSelectedTags = filter(tagMetaList, ({ tagId }) => includes(portraitTag, tagId));
            setSelectedTags(newSelectedTags);
            form.setFieldValue(
              'portraitTagIdListArr',
              map(newSelectedTags, ({ tagId, firstLevelDirId, secondLevelDirId }) => [
                firstLevelDirId,
                secondLevelDirId,
                tagId,
              ]),
            );
            delay(runSearch, 10);
          }
        }
      } catch (e) {
        message.warning('获取已保存的标签失败');
      }
    },
  });

  const { instanceOptions, requestInstancesLoading } = useRequestGetUserPackageTaskInstances({
    taskId,
  });
  const { triggerShowPortraitDrawer, ...portraitDrawerState } = usePortraitDrawer();
  const { runRequestStartDownload, requestStartDownloadLoading } =
    useRequestStartUserPackageInstanceDetailDataExcelDownload(() => {
      message.success('已发起下载');
      navigate(`/enterprise/user_package/detail/${taskId}#user_package_instance_list_table`);
    });
  const { savePortraitTagLoading, runSavePortraitTag } = useRequestSavePortraitTag();

  // eslint-disable-next-line no-use-before-define
  const columns = useCreation(() => buildColumns({ triggerShowPortraitDrawer, selectedTags }), [selectedTags]);

  const handleSelectedTagsChange = (newSelectedTags: string[]) => {
    setSelectedTemplateName(undefined);
    setSelectedTags(newSelectedTags);
  };

  const handleBtnDownloadClick = useMemoizedFn(() => {
    const portraitTagIdList = map(selectedTags, ({ tagId }) => tagId);
    runSavePortraitTag({
      taskId,
      portraitTag: portraitTagIdList,
    });
    runRequestStartDownload(instanceId, portraitTagIdList);
  });

  const handleBtnSaveTagClick = useMemoizedFn(() => {
    runSavePortraitTag({
      taskId,
      portraitTag: map(selectedTags, ({ tagId }) => tagId),
    });
  });

  return {
    form,
    tableProps,
    columns,
    runSearch,
    requestInstanceDetailDataListLoading,
    instanceOptions,
    requestInstancesLoading,
    portraitDrawerState,
    handleSelectedTagsChange,
    handleBtnDownloadClick,
    requestStartDownloadLoading,
    handleBtnSaveTagClick,
    requestSaveTagLoading: savePortraitTagLoading,
    tagDirList,
    tagDirListLoading,
    tagMetaList,
    selectedTags,
    selectedTemplateName,
    setSelectedTemplateName,
    setSelectedTags,
  };
}

function buildColumns({ triggerShowPortraitDrawer, selectedTags }: any) {
  const fixedColumns = [
    {
      title: '客户名称',
      dataIndex: 'company',
      width: 250,
      fixed: 'left',
      render(value: string) {
        return (
          <Typography.Link
            onClick={() => {
              triggerShowPortraitDrawer(value);
            }}
          >
            {value}
          </Typography.Link>
        );
      },
    },
    {
      title: 'UIN',
      dataIndex: 'uin',
      width: 150,
    },
    {
      title: '认证类型',
      dataIndex: 'property',
      width: 100,
    },
  ];

  function buildColumsForSelectedTags(selectedTags: any) {
    return map(selectedTags, ({ tagName, field_type: fieldType, field_source_key: fieldSourceKey }) => {
      return {
        title: tagName,
        dataIndex: fieldSourceKey,
        ...(fieldType === 'DATE' ? { width: 120 } : {}),
      };
    });
  }

  return [...fixedColumns, ...(isEmpty(selectedTags) ? [] : buildColumsForSelectedTags(selectedTags))];
}
