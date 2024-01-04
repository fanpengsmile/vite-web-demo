import React from 'react';
import { ProductServiceConfig, IBaseCompanyDetailProps } from './config';
import CompanyDetailComponent from './CompanyDetailComponent';
import './style.css';

export default function ProductService(props: IBaseCompanyDetailProps) {
  const { name, isShow, show, fold } = props;
  const fetchList = [];
  for (let i = 0; i < ProductServiceConfig.length; i++) {
    fetchList.push(ProductServiceConfig[i].fetch);
  }
  return (
    <CompanyDetailComponent
      name={name}
      isShow={isShow}
      show={show}
      fold={fold}
      defaultSelectValue={ProductServiceConfig[0].value}
      fetchList={fetchList}
      config={ProductServiceConfig}
      elementId={'productService_scroll_div'}
    ></CompanyDetailComponent>
  );
}

ProductService.displayName = 'ProductService';
