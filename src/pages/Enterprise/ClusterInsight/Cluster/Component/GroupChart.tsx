import React from 'react';
import { Card, Row, Col, Tooltip, Spin, Button, Modal, Table, Tag } from 'antd';
import { map, get, cloneDeep, isArray } from 'lodash';
import AbstractChart from './Charts/AbstractChart';
import DrillKeyMultiSelector from './MultiSelect';
import { RangeInput, TimeGroupSelsct, ChartTypeSelect, OrderSlect, useChartGroup } from './Charts/GroupChartItem';
import { CloseOutlined } from '@ant-design/icons';
import MouseDropdown from './MouseDropdown';

function CustomGroupChart({ customProps }: any) {
  const {
    chartData,
    setIndex,
    orderTypes,
    setOrderTypes,
    chartTypes,
    setChartTypes,
    timeType,
    setTimeTypes,
    rangeInput,
    setRangeInput,
    loading,
    showDetail,
    setShowDetail,
    detailData,
    mouseDropdownVisible,
    selectList,
    TOTAL_MENU_DATA,
    handleDrill,
    setSelectLists,
    drill,
    setDrill,
    listRef,
    pagination,
    drillParams,
    setPagination,
    fetchDetail,
    tableLoding,
  } = useChartGroup(customProps);
  const { columns } = customProps;
  return (
    <div
      style={{
        width: '100%',
        display: 'inline-block',
      }}
    >
      <>
        {drill.length > 0 ? (
          <Card>
            <div
              style={{
                marginBottom: '5px',
              }}
            >
              <div>
                {map(drill, (key, index) => (
                  <Tag key={index}>
                    <span style={{ color: 'black', fontWeight: 'bold' }}>{get(key, 'label')}</span>
                    &nbsp;-&nbsp;
                    <span style={{ color: 'black', fontWeight: 'bold' }}>
                      {get(key, 'op') === 'BETWEEN' || get(key, 'op') === '=' ? '保留:' : '排除:'}
                    </span>
                    {get(key, 'value', []).map((item, index) => {
                      return (
                        <span key={item} style={{ color: '#3da8f5' }}>
                          {(index === 0 ? '' : '&') + item}
                        </span>
                      );
                    })}
                    <CloseOutlined
                      onClick={() => {
                        const drillCopy = cloneDeep(drill);
                        drillCopy.splice(index, 1);
                        setDrill(drillCopy);
                      }}
                      style={{ color: 'red' }}
                    />
                  </Tag>
                ))}
              </div>
              <div>
                <Button
                  type='primary'
                  size='small'
                  style={{ marginRight: 5, marginTop: 10 }}
                  onClick={() => {
                    setDrill([]);
                  }}
                  id='clearChartTags'
                >
                  清空
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
        <MouseDropdown
          position={drillParams.position}
          mouseDropdownVisible={mouseDropdownVisible}
          menuData={TOTAL_MENU_DATA}
        />
        {showDetail ? (
          <Modal
            title='详情'
            onCancel={() => {
              setShowDetail(false);
              setPagination({
                current: 1,
                pageSize: 10,
                total: 0,
              });
            }}
            footer={null}
            width={1200}
            open={showDetail}
          >
            <Spin spinning={tableLoding}>
              <Table
                columns={columns}
                dataSource={detailData}
                rowKey='uin'
                pagination={pagination}
                scroll={{ x: 1800 }}
                onChange={(p: any) => {
                  setPagination({
                    ...pagination,
                    current: p.current,
                    pageSize: p.pageSize,
                  });
                  fetchDetail(p.current, p.pageSize);
                }}
              />
            </Spin>
          </Modal>
        ) : null}
        <Row gutter={24}>
          {chartData.map(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (item: { tag_name: string; is_contrast: boolean; field_type: string; is_tgi: boolean }, index: number) => {
              return (
                <Col
                  onClick={(e) => {
                    setIndex(index);
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  key={index}
                  span={12}
                >
                  <Card
                    title={get(item, 'tag_name') + (get(item, 'is_contrast') ? '-对照组' : '')}
                    style={{ marginBottom: '10px' }}
                    extra={
                      <>
                        {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          <OrderSlect orderTypes={orderTypes} index={index} setOrderTypes={setOrderTypes}></OrderSlect>
                        }
                        <ChartTypeSelect
                          chartTypes={chartTypes}
                          index={index}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          setChartTypes={setChartTypes}
                        ></ChartTypeSelect>
                        {item.field_type === 'DATE' ? (
                          <TimeGroupSelsct
                            timeType={timeType}
                            index={index}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            setTimeTypes={setTimeTypes}
                          ></TimeGroupSelsct>
                        ) : null}
                        {item.field_type === 'DOUBLE' ? (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          <RangeInput rangeInput={rangeInput} setRangeInput={setRangeInput} index={index}></RangeInput>
                        ) : null}
                      </>
                    }
                  >
                    <>
                      <DrillKeyMultiSelector
                        setSelectLists={setSelectLists}
                        selectList={selectList}
                        index={index}
                        listRef={listRef}
                        drill={drill}
                        setDrill={setDrill}
                        chartData={chartData}
                      ></DrillKeyMultiSelector>
                      <Spin spinning={!(loading[index] === undefined || loading[index] === false)}>
                        <AbstractChart
                          {...customProps}
                          index={index}
                          handleDrill={handleDrill}
                          displayResult={get(item, 'group_result')}
                          chartType={chartTypes[index]}
                          fieldType={item.field_type}
                          axisToolTipFormatter={(chartItems: any) => {
                            const chartItem = isArray(chartItems) ? get(chartItems, 0, {}) : chartItems;
                            const { name, value } = chartItem;
                            let tooltipContent = `
                          <div>${name}</div>
                          <div>用户数：${value.toLocaleString()}</div>
                      `;
                            if (item.is_tgi) {
                              tooltipContent += `<div>TGI：${get(
                                item,
                                `group_result.${chartItem.dataIndex}.tgi`,
                              )}</div>`;
                            }
                            return tooltipContent;
                          }}
                        ></AbstractChart>
                      </Spin>
                    </>
                  </Card>
                </Col>
              );
            },
          )}
        </Row>
      </>
    </div>
  );
}

export function GroupChart(props: any) {
  const { submit, fetchChartData } = props;

  return (
    <Card
      title='分析图表报告'
      style={{ marginTop: '20px' }}
      extra={
        <Tooltip title='请先点击开始分析画像按钮，再点击保存画像分析数据'>
          <Button
            onClick={() => {
              submit();
            }}
            style={{ paddingLeft: '29px', paddingRight: '28px' }}
            type='primary'
          >
            保存报告
          </Button>
        </Tooltip>
      }
    >
      <CustomGroupChart
        customProps={{
          ...props,
          fetchChartData,
        }}
      ></CustomGroupChart>
    </Card>
  );
}

GroupChart.displayName = 'GroupChart';
