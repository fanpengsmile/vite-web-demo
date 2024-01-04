import React, { useEffect } from 'react';
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { Card, Form, Empty, Typography } from 'antd';
import { useToggle } from 'ahooks';
import {
  TagParamInputGroup,
  useTagParamInputGroup,
  TagDirSelector,
  useTagDirSelector,
  tagFieldNameFieldName,
} from '../../../Common/Components/TagInput/index';
import styles from '../styles.module.css';
import { omit, reduce, find, isEmpty } from 'lodash';

const tagParamFormFormItemName = 'tagParamForm';
const globalLogicSwitchFormItemName = 'globalLogicForTagParamForm';
export function TagParamForm({
  form,
  disabled,
  isTemplateShow,
  userPackageTem,
  clearPackageSizePredictResult,
  size,
  isInnerCard = false,
  defaultHidden = false,
  importFieldsValue,
  setImportFieldsLevel,
  importFieldsLevel,
  setParamType,
  dataType,
  importInitValue,
}: any) {
  const [isCardBodyHidden, { toggle: toggleCardBodyHidden }] = useToggle(defaultHidden);
  const { oneLevelDirTagList, ...tagDirSelectorState } = useTagDirSelector(dataType);
  const { tagMetaList } = tagDirSelectorState;
  const { buildNewTagParamInputValue, ...restStateForTagParamInputGroup } = useTagParamInputGroup({
    tagMetaList,
    allowEmptyTag: false,
  });
  useEffect(() => {
    if (isTemplateShow && userPackageTem && userPackageTem.tagParamForm) {
      form.setFieldsValue({
        tagParamForm: TagParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(userPackageTem.tagParamForm),
      });
    }
  }, [tagMetaList]);

  const tagParamFormValue = Form.useWatch(tagParamFormFormItemName, form);

  const formListAddFunc = (index: number) => {
    const tagParamInputFieldsValue = form.getFieldValue([tagParamFormFormItemName, index]);
    const { [tagFieldNameFieldName]: tagFieldNameValue } = tagParamInputFieldsValue;
    form.setFieldValue([tagParamFormFormItemName, index, 'children', 0], {
      ...omit(tagParamInputFieldsValue, ['children', 'logicForChildren', tagFieldNameFieldName]),
      [tagFieldNameFieldName]: reduce(
        oneLevelDirTagList,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (result, { value: firstLevelDirName, children }) => {
          if (find(children, { value: tagFieldNameValue })) {
            return [firstLevelDirName, tagFieldNameValue];
          }
          return result;
        },
        [],
      ),
    });
    form.setFieldValue(
      [tagParamFormFormItemName, index, 'children', 1],
      TagParamInputGroup.buildEmptyTagParamInputValue(false),
    );

    clearPackageSizePredictResult();
  };

  return (
    <Card
      title='标签圈选'
      className='mb15'
      size={size}
      type={isInnerCard ? 'inner' : undefined}
      extra={
        <Typography.Link onClick={toggleCardBodyHidden}>
          {isCardBodyHidden ? <PlusSquareOutlined /> : <MinusSquareOutlined />}
        </Typography.Link>
      }
      bodyStyle={{ display: isCardBodyHidden ? 'none' : undefined }}
    >
      <Form.Item name={globalLogicSwitchFormItemName} noStyle hidden />
      <Form.List name={tagParamFormFormItemName}>
        {(fields, { add, remove }) => (
          <div style={{ display: 'flex' }}>
            <TagDirSelector
              disabled={disabled}
              onTagDirLeafClick={(relateTag: string) => {
                const relTag = buildNewTagParamInputValue(relateTag);
                add(relTag);
              }}
              {...tagDirSelectorState}
            />
            <div className={styles['tag-param-input-group-container']}>
              {isEmpty(tagParamFormValue) ? (
                <Empty
                  style={{ marginTop: '75px' }}
                  description={disabled ? '当前标签圈选条件为空' : '请选中左侧标签配置标签圈选条件'}
                />
              ) : (
                <TagParamInputGroup
                  form={form}
                  formItemName={[tagParamFormFormItemName]}
                  allowSelectTag={false}
                  disabled={disabled}
                  formListFields={fields}
                  formListRemove={remove}
                  formListAdd={formListAddFunc}
                  tagMetaList={tagMetaList}
                  allowNoAnyTagParamInput
                  setParamType={setParamType}
                  paramType='tag'
                  setImportFieldsLevel={setImportFieldsLevel}
                  importFieldsLevel={importFieldsLevel}
                  importFieldsValue={importFieldsValue}
                  importInitValue={importInitValue}
                  globalLogicSwitchFormItemName={globalLogicSwitchFormItemName}
                  isUseAlphabetIndex={false}
                  clearPackageSizePredictResult={clearPackageSizePredictResult}
                  oneLevelDirTagList={oneLevelDirTagList}
                  needCardBorder
                  {...restStateForTagParamInputGroup}
                />
              )}
            </div>
          </div>
        )}
      </Form.List>
    </Card>
  );
}
TagParamForm.displayName = 'TagParamForm';
TagParamForm.formName = 'tagParamForm';
