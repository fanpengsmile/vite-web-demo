import React from 'react';
import { Form, message } from 'antd';
import { useSafeState } from 'ahooks';
import { useRequestGetOpportunityList } from '../../base/cgi';
import { FilterContainer, useFilterContainer } from './FilterCondition/FilterContainer';
import { ListTable } from './ListDeatil/ListTable';
import { PortraitDrawer, usePortraitDrawer } from './ListDeatil/PortraitDrawer';
import { delay, get } from 'lodash';

export default function OpportunityList() {
  const [listTableVisible, setSistTableVisible] = useSafeState(false);
  const [keywordSearchParams, setKeywordSearchParams] = useSafeState({});
  const [optionSelectParams, setOptionSelectParams] = useSafeState({});

  const { triggerShowPortraitDrawer, ...portraitDrawerState } = usePortraitDrawer();

  const [optionSelectForm] = Form.useForm();
  const [keywordSearchForm] = Form.useForm();
  const {
    tableProps,
    requestOpportunityListLoading,
    search: { submit: runRequestOpportunityList },
  } = useRequestGetOpportunityList({
    form: optionSelectForm,
    keywordSearchParams,
  });
  const filterContainerState = useFilterContainer({
    keywordSearchForm,
    optionSelectForm,
    onOptionSelectFormSubmit: () => {
      setOptionSelectParams(optionSelectForm.getFieldsValue());
      setSistTableVisible(true);
      delay(runRequestOpportunityList, 0);
    },
    onKeywordSearchFormSubmit: () => {
      const keySearchValue = keywordSearchForm.getFieldsValue();
      if (get(keySearchValue, 'keywordSearchType') === 'name' && !get(keySearchValue, 'keywordSearchValue')) {
        message.error('请输入要查询的企业名称');
        return;
      }
      setKeywordSearchParams(keySearchValue);
      setSistTableVisible(true);
      delay(runRequestOpportunityList, 0);
    },
  });
  const afterClearAllParams = () => {
    setSistTableVisible(false);
  };

  const afterClearOneParam = () => {
    delay(runRequestOpportunityList, 0);
  };

  const handleClickCompanyName = (targetCompanyName: string) => {
    triggerShowPortraitDrawer(targetCompanyName);
  };

  return (
    <div style={{ minWidth: 1000 }}>
      <FilterContainer
        {...filterContainerState}
        keywordSearchParams={keywordSearchParams}
        setKeywordSearchParams={setKeywordSearchParams}
        optionSelectParams={optionSelectParams}
        setOptionSelectParams={setOptionSelectParams}
        afterClearAllParams={afterClearAllParams}
        afterClearOneParam={afterClearOneParam}
      />

      {listTableVisible && (
        <ListTable
          tableProps={tableProps}
          loading={requestOpportunityListLoading}
          onClickCompanyName={handleClickCompanyName}
        />
      )}

      <PortraitDrawer {...portraitDrawerState} />
    </div>
  );
}

OpportunityList.displayName = 'OpportunityList';
