import React, { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import './TagParam.css';
import { get, find } from 'lodash';

const OPERATOR_OPTION_LIST = [
  { label: '相对时间', value: 'RECENT' },
  { label: '相对时间段', value: 'BETWEEN DYNAMIC TIME' },
  { label: '固定时间段', value: 'BETWEEN STATIC TIME' },
  { label: '区间', value: 'BETWEEN' },
  { label: '等于', value: '=' },
  { label: '不等于', value: '<>' },
  { label: '大于', value: '>' },
  { label: '小于', value: '<' },
  { label: '大于等于', value: '>=' },
  { label: '小于等于', value: '<=' },
  { label: '包含', value: 'IN' },
  { label: '不包含', value: 'NOT IN' },
  { label: '为空', value: 'IS NULL' },
  { label: '不为空', value: 'IS NOT NULL' },
];

export const TagParamInputGroupImportDialog = ({
  importDialogVisible,
  setImportDialogVisible,
  submit,
  importFieldsLevel,
  form,
  tagMetaList,
  paramType,
  importInitValue,
}: any) => {
  const [importValue, setImportValue] = useState('');
  let tagFieldName = '';
  let condition = '=';
  let enName = '';
  let conVal = '';
  if (paramType === 'tag') {
    const tagParamValue = form.getFieldValue('tagParamForm');
    if (importFieldsLevel.length === 1) {
      condition = get(tagParamValue, `${get(importFieldsLevel, '0')}.operator`);
      tagFieldName = get(tagParamValue, `${get(importFieldsLevel, '0')}.tagFieldName`);
    } else {
      condition = get(
        // eslint-disable-next-line prettier/prettier
          tagParamValue, `${importFieldsLevel[0]}.children.${importFieldsLevel[1]}.operator`
      );
      tagFieldName = get(
        // eslint-disable-next-line prettier/prettier
          tagParamValue, `${importFieldsLevel[0]}.children.${importFieldsLevel[1]}.tagFieldName.1`
      );
    }
    enName = get(find(tagMetaList, { tag_en_name: tagFieldName }), 'fieldCnName', '');
    conVal = get(find(OPERATOR_OPTION_LIST, { value: condition }), 'label', '');
  } else if (paramType === 'behavior') {
    const behaviorParamValue = form.getFieldValue('behaviorParamForm');
    tagFieldName =
      behaviorParamValue[get(importFieldsLevel, '0')].eventPropertyParams[get(importFieldsLevel, '1')].tagFieldName;
    enName = get(find(tagMetaList, { fieldName: tagFieldName }), 'fieldCnName', '');
    condition =
      behaviorParamValue[get(importFieldsLevel, '0')].eventPropertyParams[get(importFieldsLevel, '1')].operator;
    conVal = get(find(OPERATOR_OPTION_LIST, { value: condition }), 'label', '');
  }
  useEffect(() => {
    let initValue = importInitValue();
    if (initValue.length > 1) {
      initValue = initValue.join('\n');
    } else {
      initValue = '';
    }
    setImportValue(initValue);
  }, []);
  return (
    <Modal
      title={`${enName}  ${conVal}`}
      open={importDialogVisible}
      maskClosable={false}
      onCancel={() => {
        setImportValue('');
        setImportDialogVisible(false);
      }}
      onOk={() => {
        const relValue = importValue.split('\n').filter((item) => item);
        submit(relValue);
        setImportDialogVisible(false);
        setImportValue('');
      }}
    >
      <>
        <p>注意： 按换行符分隔，每行一个值</p>
        <Input.TextArea
          value={importValue}
          placeholder={`导入数据-1\n导入数据-2\n导入数据-3\n导入数据-4\n导入数据-5`}
          onChange={(e) => {
            setImportValue(e.target.value);
          }}
          rows={12}
        ></Input.TextArea>
      </>
    </Modal>
  );
};
TagParamInputGroupImportDialog.displayName = 'TagParamInputGroupImportDialog';
