import React from 'react';
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import { customOptionValue } from '../../config';
import { FilterConditionDisplay } from './FilterConditionDisplay';
import { OptionSelectForm } from './OptionSelectForm';
import { KeywordSearch } from './KeywordSearch';

export function FilterContainer({
  optionSelectForm,
  keywordSearchForm,
  onOptionSelectFormValuesChangeSubmit,
  onKeywordSearchFormSubmit,
  keywordSearchParams,
  optionSelectParams,
  setKeywordSearchParams,
  setOptionSelectParams,
  afterClearAllParams,
  afterClearOneParam,
}: any) {
  return (
    <Card className='mb15'>
      <KeywordSearch form={keywordSearchForm} onSubmitSearch={onKeywordSearchFormSubmit} />
      <OptionSelectForm form={optionSelectForm} onFormValuesChangeSubmit={onOptionSelectFormValuesChangeSubmit} />
      <FilterConditionDisplay
        optionSelectForm={optionSelectForm}
        keywordSearchForm={keywordSearchForm}
        keywordSearchParams={keywordSearchParams}
        setKeywordSearchParams={setKeywordSearchParams}
        optionSelectParams={optionSelectParams}
        setOptionSelectParams={setOptionSelectParams}
        afterClearAllParams={afterClearAllParams}
        afterClearOneParam={afterClearOneParam}
      />
    </Card>
  );
}
FilterContainer.displayName = 'FilterContainer';

export function useFilterContainer({
  keywordSearchForm,
  optionSelectForm,
  onOptionSelectFormSubmit,
  onKeywordSearchFormSubmit,
}: any) {
  const onOptionSelectFormValuesChangeSubmit = (changedFields: any, allValues: { start_date: string }) => {
    /* “成立时间”(start_day_level)设置为“自定义”后，若未配置具体的时间段(start_date)，则不触发搜索 */
    if (changedFields.start_day_level?.length === 1 && changedFields.start_day_level[0] === customOptionValue) {
      if (isEmpty(allValues.start_date)) {
        return;
      }
    }

    onOptionSelectFormSubmit();
  };

  return {
    keywordSearchForm,
    optionSelectForm,
    onKeywordSearchFormSubmit,
    onOptionSelectFormValuesChangeSubmit,
  };
}
