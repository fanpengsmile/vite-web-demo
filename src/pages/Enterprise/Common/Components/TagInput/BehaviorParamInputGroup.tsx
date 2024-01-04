import React from 'react';
import { isEmpty, map, last } from 'lodash';
import { BehaviorParamInput, globalLogicForEventPropertyParamInputFieldName } from './BehaviorParamInput';
import { TagParamInputGroup } from './TagParamInputGroup';

export const BehaviorParamInputGroup = ({
  form,
  formItemName,
  disabled,
  formListFields,
  formListRemove,
  eventList,
  clearPackageSizePredictResult,
  importFieldsValue,
  setImportFieldsLevel,
  importFieldsLevel,
  setParamType,
  importInitValue,
}: any) => {
  return isEmpty(formListFields)
    ? null
    : formListFields.map((field: any, index: number) => (
        <BehaviorParamInput
          key={field.key}
          form={form}
          setImportFieldsLevel={setImportFieldsLevel}
          importFieldsLevel={importFieldsLevel}
          importFieldsValue={importFieldsValue}
          importInitValue={importInitValue}
          setParamType={setParamType}
          behaviorFieldIndex={index}
          formItemNamePrefixArr={formItemName}
          index={field.name}
          eventList={eventList}
          disabled={disabled}
          triggerDelete={() => {
            formListRemove(field.name);
          }}
          clearPackageSizePredictResult={clearPackageSizePredictResult}
        />
      ));
};
BehaviorParamInputGroup.displayName = 'BehaviorParamInputGroup';
BehaviorParamInputGroup.buildEmptyBehaviorParamInputValue = () => {
  return {
    eventTypeTag: 1,
    event: undefined,
    eventId: undefined,
    eventFieldName: undefined,
    dataType: undefined,
    key: Date.now(),
    [globalLogicForEventPropertyParamInputFieldName]: 'AND',
    eventPropertyParams: [TagParamInputGroup.buildEmptyTagParamInputValue()],
  };
};
BehaviorParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat = (frontendFieldsValue: any[]) => {
  return map(frontendFieldsValue, ({ eventPropertyParams: originEventPropertyParams, ...restFields }) => {
    const eventPropertyParams =
      TagParamInputGroup.convertFrontendFieldsValueToLayoutColumnFormat(originEventPropertyParams);

    return { eventPropertyParams, ...restFields };
  });
};
BehaviorParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat = (layoutColumnFieldsValue: any[]) => {
  return map(
    layoutColumnFieldsValue,
    ({ eventTypeTag: originEventTypeTag, eventPropertyParams: originEventPropertyParams, ...restFields }) => {
      return {
        ...restFields,
        eventTypeTag: originEventTypeTag ?? 1,
        eventPropertyParams:
          TagParamInputGroup.convertLayoutColumnFieldsValueToFrontendFormat(originEventPropertyParams),
      };
    },
  );
};
/* 后台接口参数格式参考：https://opc-mock.woa.com/project/553/interface/api/4975 */
BehaviorParamInputGroup.convertFrontendFieldsValueToBackendFormat = (
  frontendFieldsValue: any[],
  globalLogic: string,
) => {
  if (isEmpty(frontendFieldsValue)) return {};
  return {
    logic: globalLogic,
    items: map(
      frontendFieldsValue,
      ({
        eventPropertyParams,
        event,
        eventTypeTag,
        [globalLogicForEventPropertyParamInputFieldName]: globalLogicForEventPropertyParamInput,
      }) => {
        const eventId = last(event);
        return {
          event_tag: eventTypeTag,
          event_id: eventId,
          event_rule: TagParamInputGroup.convertFrontendFieldsValueToBackendFormat(
            eventPropertyParams,
            globalLogicForEventPropertyParamInput,
            { backendIdFieldName: 'property_id' },
          ),
        };
      },
    ),
  };
};
