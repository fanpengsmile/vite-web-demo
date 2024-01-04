import React from 'react';
import { Card, Typography, Spin, Form, Empty, message } from 'antd';
import { FilterOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import { LogicSwitch } from '../../../Common/Components/TagInput/LogicSwitch';
import { BehaviorParamInputGroup } from '../../../Common/Components/TagInput/BehaviorParamInputGroup';
import { useEventList } from '../../../base/cgi';
import { isEmpty } from 'lodash';

const globalLogicSwitchFormName = 'globalLogicForBehaviorParamForm';
const behaviorParamFormFormName = 'behaviorParamForm';
export function BehaviorParamForm({
  form,
  disabled,
  clearPackageSizePredictResult,
  size,
  isInnerCard = false,
  defaultHidden = false,
  importFieldsValue,
  setImportFieldsLevel,
  importFieldsLevel,
  setParamType,
  importInitValue,
}: any) {
  const [isCardBodyHidden, { toggle: toggleCardBodyHidden }] = useToggle(defaultHidden);
  const { eventList, eventListLoading } = useEventList();
  const globalLogicSwitchValue = Form.useWatch(globalLogicSwitchFormName, form);
  const behaviorParamFormValue = Form.useWatch(behaviorParamFormFormName, form);

  const returnHandleAddNewBehaviorParam = (add: (data: any) => void) => {
    return () => {
      if (behaviorParamFormValue?.length >= 25) {
        message.warning('不能添加更多筛选条件');
        return;
      }
      add(BehaviorParamInputGroup.buildEmptyBehaviorParamInputValue());
    };
  };

  return (
    <Card
      title='行为圈选'
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
      <Spin spinning={!!eventListLoading}>
        <Form.Item name={globalLogicSwitchFormName} noStyle hidden />

        <Form.List name={behaviorParamFormFormName}>
          {(fields, { add, remove }) => (
            <>
              <div className='mb15' style={{ width: '100%', display: 'flex' }}>
                <span style={{ flex: 1 }}>用户行为满足</span>
                {!disabled && (
                  <Typography.Link onClick={returnHandleAddNewBehaviorParam(add)}>
                    <FilterOutlined />
                    添加筛选
                  </Typography.Link>
                )}
              </div>
              {isEmpty(behaviorParamFormValue) ? (
                <Empty
                  style={{ border: '1px solid rgba(0,0,0,0.06)', padding: 20 }}
                  description={
                    disabled ? (
                      <span>当前行为圈选筛选条件为空</span>
                    ) : (
                      <span>
                        请添加行为
                        <Typography.Link onClick={returnHandleAddNewBehaviorParam(add)}>圈选条件</Typography.Link>
                      </span>
                    )
                  }
                />
              ) : (
                <div style={{ display: 'flex', minHeight: 180 }}>
                  {behaviorParamFormValue?.length > 1 && (
                    <LogicSwitch
                      value={globalLogicSwitchValue}
                      type={2}
                      onChange={(newValue: string) => {
                        if (disabled) {
                          message.warning('当前状态禁止编辑');
                          return;
                        }
                        form.setFieldValue(globalLogicSwitchFormName, newValue);
                        clearPackageSizePredictResult();
                      }}
                    />
                  )}

                  <div style={{ flex: 1 }}>
                    <BehaviorParamInputGroup
                      form={form}
                      setImportFieldsLevel={setImportFieldsLevel}
                      importFieldsLevel={importFieldsLevel}
                      importFieldsValue={importFieldsValue}
                      importInitValue={importInitValue}
                      setParamType={setParamType}
                      formItemName={[behaviorParamFormFormName]}
                      disabled={disabled}
                      formListFields={fields}
                      formListRemove={remove}
                      eventList={eventList}
                      clearPackageSizePredictResult={clearPackageSizePredictResult}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </Form.List>
      </Spin>
    </Card>
  );
}
BehaviorParamForm.displayName = 'BehaviorParamForm';
BehaviorParamForm.formName = 'behaviorParamForm';
