import React from 'react';
import { EnterprisePersonnelConfig, IBaseCompanyDetailProps } from './config';
import CompanyDetailComponent from './CompanyDetailComponent';
import './style.css';

export default function EnterprisePersonnel(props: IBaseCompanyDetailProps) {
  const { name, isShow, show, fold, desensitize } = props;
  const fetchList = [];
  for (let i = 0; i < EnterprisePersonnelConfig.length; i++) {
    fetchList.push(EnterprisePersonnelConfig[i].fetch);
  }
  return (
    <CompanyDetailComponent
      name={name}
      isShow={isShow}
      show={show}
      fold={fold}
      defaultSelectValue={EnterprisePersonnelConfig[0].value}
      fetchList={fetchList}
      config={EnterprisePersonnelConfig}
      desensitize={desensitize}
      elementId={'enterprise_personnel_scroll_div'}
    ></CompanyDetailComponent>
  );
}

EnterprisePersonnel.displayName = 'EnterprisePersonnel';
