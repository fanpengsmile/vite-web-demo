import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { isArray, map, get, isEmpty, clone } from 'lodash';
import { Space, Button, Descriptions, Table, Spin } from 'antd';
import './style.css';
import { message } from 'tdesign-react';
import { ICompanyDetailComponent } from './config';
import type { PaginationProps } from 'antd';

export default function CompanyDetailComponent({
  name,
  isShow,
  show,
  defaultSelectValue,
  fetchList,
  config,
  elementId,
  fold,
  desensitize = false,
}: ICompanyDetailComponent) {
  const itemStyle = {
    labelStyle: { width: '10%' },
    contentStyle: { width: '23%' },
  };
  const [basicInformationData, setBasicInformationData] = useState({});
  const [selectValue, setSelectValue] = useState(defaultSelectValue);
  const [loading, setLoading] = useState(true);
  const [scrollHeight, setScrollHeight] = useState(1000);
  const clickToFocus = useRef(false);
  const [pagination, setPagination] = useState<{ [key in string]: PaginationProps }>({});
  const setCompanyDetailDomHeight = () => {
    const scrollDom = document.getElementById(elementId);
    if (!scrollDom) return;
    const { top } = scrollDom.getBoundingClientRect();
    setTimeout(() => {
      setScrollHeight(document.getElementsByTagName('body')[0].offsetHeight - top - 2);
    }, 300);
    scrollDom.addEventListener('scroll', () => {
      if (clickToFocus.current) return;
      let selectClient = '';
      for (let i = 0; i < config.length; i++) {
        const clientRect = document.getElementById(config[i].value);
        if (clientRect && clientRect.offsetTop - scrollDom.scrollTop < 20) {
          selectClient = config[i].value;
        }
      }
      setSelectValue(selectClient);
    });
  };
  useEffect(() => {
    // 数据展示改为懒加载
    if (!show || !isShow || (!isEmpty(basicInformationData) && get(basicInformationData, 'currentName') === name))
      return;
    const fetchBasicInformation = async (name: string) => {
      const param = {
        name,
        page_index: 1,
        page_size: 10,
      };
      const res = [];
      setLoading(true);
      try {
        for (let i = 0; i < fetchList.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          res[i] = await fetchList[i](param);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
      const cd = {} as any;
      const paginationInfo = {} as any;
      for (let j = 0; j < config.length; j++) {
        cd[get(config[j], 'value')] = get(res[j], '0');
        paginationInfo[get(config[j], 'value')] = {
          pageSize: 10,
          current: 1,
          total: get(res[j], '0.total', 0),
          size: 'small',
        };
      }
      cd.currentName = name;
      setBasicInformationData(cd);
      setPagination(paginationInfo);
      setLoading(false);
      setCompanyDetailDomHeight();
    };
    fetchBasicInformation(name);
  }, [name, show, isShow, fold]);
  useLayoutEffect(() => {
    if (!show || !isShow) return;
    // 主要为cem嵌入页面做改善
    // 解释一下为什么需要为dom调整高度的方法需要调用两次
    // 由于我们的UI展示这块采用的是懒加载的模式
    // 接口调用需要时间，这个时候页面上没有数据还在加载，dom还没有被paint
    // 如果这时用户滚动鼠标scroll，就会导致高度计算失败
    // 而且切换完tab之后，数据会缓存，下次切换tab不会进行数据加载了，这个时候就可以直接设置高度了
    setCompanyDetailDomHeight();
  }, [isShow, fold, isShow, name]);

  return (
    <div style={isShow ? {} : { display: 'none' }}>
      <Spin spinning={loading}>
        <Space style={{ marginBottom: '20px' }}>
          {map(config, ({ value, label }) => {
            let style =
              selectValue === value
                ? {
                    padding: '5px 10px 5px 10px',
                    backgroundColor: '#ecf6ff',
                    border: 'none',
                    color: '#2e80f0',
                  }
                : {
                    padding: '5px 10px 5px 10px',
                    backgroundColor: '#f1f4f7',
                    border: 'none',
                    color: '#232f43',
                  };
            const disabled =
              get(basicInformationData, `${value}.total`) !== undefined
                ? get(basicInformationData, `${value}.total`, 0) === 0
                : !get(basicInformationData, `${value}`);
            if (disabled) {
              style = {
                padding: '5px 10px 5px 10px',
                backgroundColor: '#fafafa',
                border: 'none',
                color: 'rgba(0, 0, 0, 0.25)',
              };
            }
            return (
              <Button
                key={value}
                style={style}
                disabled={disabled}
                onMouseDown={() => {
                  setSelectValue(value);
                  const bridge = document.querySelector(`#${value}`);
                  clickToFocus.current = true;
                  // eslint-disable-next-line no-unused-expressions
                  bridge && bridge.scrollIntoView();
                }}
                onMouseUp={() => {
                  clickToFocus.current = false;
                }}
              >
                {`${label}${
                  // eslint-disable-next-line no-nested-ternary
                  get(basicInformationData, `${value}.total`) !== undefined
                    ? get(basicInformationData as any, `${value}.total`) > 0
                      ? `(${get(basicInformationData, `${value}.total`)})`
                      : ''
                    : ''
                }`}
              </Button>
            );
          })}
        </Space>
        <div
          id={elementId}
          style={{
            height: `${scrollHeight}px`,
            overflow: 'scroll',
            position: 'relative',
          }}
        >
          {config.map((item: any, index: number) => {
            let list = get(basicInformationData, `${item.value}.list`);
            let itemColumns = item.columns;
            itemColumns = itemColumns
              ? itemColumns.map((ic: any) => {
                  if (ic?.desensitize && desensitize) {
                    ic.render = (v: string) => {
                      return `${v}`
                        .split('')
                        .map((vitem, vindex) => {
                          if (vindex === 0 || vindex === 1 || vindex === v.length - 2 || vindex === v.length - 1) {
                            return vitem;
                          }
                          return '*';
                        })
                        .join('');
                    };
                    return ic;
                  }
                  return ic;
                })
              : itemColumns;
            if (isArray(list)) {
              if ((list as []).length <= 0) return null;
              return (
                <div key={item.value} id={item.value} style={{ marginTop: index === 0 ? 0 : '20px' }}>
                  <span
                    style={{
                      fontSize: '15px',
                      color: `rgba(0, 0, 0, 0.85)`,
                      fontWeight: 'bold',
                      lineHeight: '18px',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        backgroundColor: '#3da8f5',
                        height: '18px',
                        float: 'left',
                        marginRight: '5px',
                      }}
                    ></div>
                    {item.label}
                  </span>
                  <Table
                    dataSource={list}
                    bordered
                    className='company_detail_table'
                    style={{ marginTop: '20px' }}
                    columns={itemColumns}
                    pagination={pagination[item.value]}
                    onChange={(v) => {
                      // eslint-disable-next-line no-use-before-define
                      fetchCompanyDetail(
                        pagination,
                        item.value,
                        v,
                        setPagination,
                        item.fetch,
                        name,
                        setBasicInformationData,
                        basicInformationData,
                      );
                    }}
                  />
                </div>
              );
            }
            list = get(basicInformationData, `${item.value}`);
            if (item.resValue) {
              list = get(list, `${item.resValue}`);
            }
            // eslint-disable-next-line consistent-return
            if (!list) return;
            return (
              <div key={item.value} id={item.value} style={{ marginTop: index === 0 ? '0px' : '20px' }}>
                <span
                  style={{
                    fontSize: '15px',
                    color: `rgba(0, 0, 0, 0.85)`,
                    fontWeight: 'bold',
                    lineHeight: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '5px',
                      backgroundColor: '#3da8f5',
                      height: '18px',
                      float: 'left',
                      marginRight: '5px',
                    }}
                  ></div>
                  {item.label}
                </span>
                <Descriptions style={{ marginTop: '20px' }} column={get(item, 'descriptionsColumn', 2)} bordered>
                  {get(item, 'option', []).map((oitem: any) => {
                    // const itemValue = get(list, `${oitem.value}`, '')
                    let itemValue = '';
                    if (isArray(oitem.value)) {
                      for (let i = 0; i < oitem.value.length; i++) {
                        const labelItem = get(list, `${oitem.value[i]}`, '');
                        // eslint-disable-next-line no-continue
                        if (!labelItem) continue;
                        if (i === 0) {
                          itemValue += labelItem;
                        } else {
                          itemValue = `${itemValue}/${labelItem}`;
                        }
                      }
                    } else {
                      itemValue = get(list, `${oitem.value}`, '');
                    }
                    return (
                      <Descriptions.Item
                        style={{ width: '200px' }}
                        key={oitem.value}
                        label={oitem.label}
                        span={get(oitem, 'span', 1)}
                        {...itemStyle}
                      >
                        {itemValue}
                      </Descriptions.Item>
                    );
                  })}
                </Descriptions>
              </div>
            );
          })}
        </div>
      </Spin>
    </div>
  );
}

async function fetchCompanyDetail(
  pagination: PaginationProps,
  value: string,
  v: PaginationProps,
  setPagination: any,
  fetch: any,
  name: string,
  setCompanyDetailData: any,
  basicInformationData: any,
) {
  const newPagination = clone(pagination) as any;
  newPagination[value] = {
    ...newPagination[value],
    ...v,
  };
  setPagination(newPagination);
  const [res, err] = await fetch({
    page_index: v.current,
    page_size: v.pageSize,
    ...newPagination,
    name,
  });
  if (err) {
    message.error(err.message);
    return;
  }
  const newdata = clone(basicInformationData);
  newdata[value] = res;
  setCompanyDetailData(newdata);
}

CompanyDetailComponent.displayName = 'CompanyDetailComponent';
