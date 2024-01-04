import React from 'react';
import { IntellectualPropertyConfig, IBaseCompanyDetailProps } from './config';
import CompanyDetailComponent from './CompanyDetailComponent';
import './style.css';

export default function IntellectualProperty(props: IBaseCompanyDetailProps) {
  const { name, isShow, show, fold } = props;
  const fetchList = [];
  for (let i = 0; i < IntellectualPropertyConfig.length; i++) {
    fetchList.push(IntellectualPropertyConfig[i].fetch);
  }
  return (
    <CompanyDetailComponent
      name={name}
      fold={fold}
      isShow={isShow}
      show={show}
      defaultSelectValue={IntellectualPropertyConfig[0].value}
      fetchList={fetchList}
      config={IntellectualPropertyConfig}
      elementId={'intellectual_property_scroll_div'}
    ></CompanyDetailComponent>
  );
}

IntellectualProperty.displayName = 'IntellectualProperty';
