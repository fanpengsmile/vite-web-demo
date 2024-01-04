import React from 'react';
import { DevelopmentManagementConfig, IBaseCompanyDetailProps } from './config';
import CompanyDetailComponent from './CompanyDetailComponent';
import './style.css';

export default function DevelopmentManagement(props: IBaseCompanyDetailProps) {
  const { name, isShow, show, fold } = props;
  const fetchList = [];
  for (let i = 0; i < DevelopmentManagementConfig.length; i++) {
    fetchList.push(DevelopmentManagementConfig[i].fetch);
  }
  return (
    <CompanyDetailComponent
      name={name}
      isShow={isShow}
      fold={fold}
      show={show}
      defaultSelectValue={DevelopmentManagementConfig[0].value}
      fetchList={fetchList}
      config={DevelopmentManagementConfig}
      elementId={'development_management_scroll_div'}
    ></CompanyDetailComponent>
  );
}

DevelopmentManagement.displayName = 'DevelopmentManagement';
