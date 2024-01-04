import React from 'react';
import { message, Col, Row, Input, Cascader, Modal } from 'antd';
import StaffSelect from 'components/StaffSelect';
import { find, last, get } from 'lodash';
import { UserPackageEdit } from '../../Edit/UserPackageEdit';
import { editTemplateList } from 'services/enterprise';
import { userIdTypeOptions, packageTemplateList } from '../../config';

export function TemplateDialog(props: any) {
  const {
    setShowTemplateDialog,
    showTemplateDialog,
    isDetail,
    showTemplateValue,
    tagMetaList,
    fetchTemplateNameList,
    setShowTemplateValue,
    tagDirList,
    common,
  } = props;
  return (
    <>
      <Modal
        onCancel={() => setShowTemplateDialog('')}
        open={showTemplateDialog === 'tag_list'}
        onOk={async () => {
          if (isDetail) {
            setShowTemplateDialog('');
            return;
          }
          const tagList = showTemplateValue.tag.map((tagIdArr: Array<any>) => {
            return tagMetaList.find((tag: { tagId: number }) => tag.tagId === tagIdArr[tagIdArr.length - 1]);
          });
          const [res, err] = await editTemplateList({
            template_para: JSON.stringify(tagList),
            owner_list: showTemplateValue.owner,
            template_id: showTemplateValue.id,
            remark: showTemplateValue.remark,
            template_name: showTemplateValue.name,
          });
          if (err) {
            message.error(err.message);
            return;
          }
          if (res) {
            message.success('编辑成功');
            setShowTemplateDialog('');
            fetchTemplateNameList(true);
          } else {
            message.error('编辑失败');
          }
        }}
        title={isDetail ? '查看模板' : '编辑模板'}
      >
        <Row gutter={24}>
          <Col span={5} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模板名称:
          </Col>
          <Col span={19}>
            <Input
              value={showTemplateValue.name}
              disabled={isDetail}
              onInput={(e: any) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  name: e.target.value,
                });
              }}
              placeholder='请输入模板名称'
            ></Input>
          </Col>
          <Col span={5} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模板说明:
          </Col>
          <Col span={19}>
            <Input
              value={showTemplateValue.remark}
              disabled={isDetail}
              placeholder='请输入模板说明'
              onInput={(e: any) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  remark: e.target.value,
                });
              }}
            ></Input>
          </Col>
          <Col span={5} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模版类型:
          </Col>
          <Col span={19}>
            <Input
              value={get(find(packageTemplateList, { value: showTemplateValue.type }), 'label')}
              disabled
              placeholder='请输入模版类型'
            ></Input>
          </Col>
          <Col span={5} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            关注人:
          </Col>
          <Col span={19}>
            <StaffSelect
              onChange={(v) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  owner: v,
                });
              }}
              placeholder='请输入任务责任人'
              multiple
              clearable
            />
          </Col>
          <Col span={5} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            标签详情:
          </Col>
          <Col span={19}>
            <Cascader
              options={tagDirList}
              onChange={(v) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  tag: v,
                });
              }}
              style={{ width: '100%' }}
              value={showTemplateValue.tag}
              disabled={isDetail}
              allowClear
              multiple
              showSearch
              displayRender={(label) => last(label)}
              showCheckedStrategy={Cascader.SHOW_CHILD}
            />
          </Col>
        </Row>
      </Modal>
      <Modal
        width={1600}
        footer={null}
        onCancel={() => setShowTemplateDialog('')}
        open={showTemplateDialog === 'user_package'}
        title={isDetail ? '查看模板' : '编辑模板'}
      >
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模板名称:
          </Col>
          <Col span={6}>
            <Input
              value={showTemplateValue.name}
              disabled={isDetail}
              onInput={(e: any) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  name: e.target.value,
                });
              }}
              placeholder='请输入模板名称'
            ></Input>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模板说明:
          </Col>
          <Col span={6}>
            <Input
              value={showTemplateValue.remark}
              disabled={isDetail}
              placeholder='请输入模板说明'
              onInput={(e: any) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  remark: e.target.value,
                });
              }}
            ></Input>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            ID类型:
          </Col>
          <Col span={6}>
            <Input
              value={
                find(userIdTypeOptions, {
                  value: showTemplateValue.dataType,
                })?.label
              }
              disabled
              placeholder='请输入ID类型'
            ></Input>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            模版类型:
          </Col>
          <Col span={6}>
            <Input
              value={get(find(packageTemplateList, { value: showTemplateValue.type }), 'label')}
              disabled
              placeholder='请输入模版类型'
            ></Input>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            关注人:
          </Col>
          <Col span={6}>
            <StaffSelect
              onChange={(v) => {
                setShowTemplateValue({
                  ...showTemplateValue,
                  owner: v,
                });
              }}
              placeholder='请输入任务责任人'
              multiple
              clearable
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={2} style={{ lineHeight: '33px', marginBottom: '10px' }}>
            标签详情:
          </Col>
          <Col span={24}>
            <UserPackageEdit
              common={common}
              mode={'edit'}
              userPackageTemValue={{
                showTemplateValue,
                isTemplateShow: true,
                setShowTemplateDialog,
                templateDetail: isDetail,
              }}
            ></UserPackageEdit>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
TemplateDialog.displayName = 'TemplateDialog';
