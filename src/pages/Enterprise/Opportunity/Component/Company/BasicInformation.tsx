import React from 'react';
import { BasicInformationConfig, IBaseCompanyDetailProps } from './config';
import CompanyDetailComponent from './CompanyDetailComponent';
import './style.css';

export default function BasicInformation({ name, isShow, show, fold }: IBaseCompanyDetailProps) {
  const fetchList = [];
  for (let i = 0; i < BasicInformationConfig.length; i++) {
    fetchList.push(BasicInformationConfig[i].fetch);
  }
  return (
    <CompanyDetailComponent
      name={name}
      isShow={isShow}
      show={show}
      fold={fold}
      defaultSelectValue={BasicInformationConfig[0].value}
      fetchList={fetchList}
      config={BasicInformationConfig}
      elementId={'basic_information_scroll_div'}
    ></CompanyDetailComponent>
  );
}

BasicInformation.displayName = 'BasicInformation';
