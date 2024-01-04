import React, { useState, useEffect, useRef } from 'react';
import { Radio, Tooltip, Select, message, Input } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { get, map, filter, includes, cloneDeep } from 'lodash';
import { TOTAL_CHART_TYPE, ORDER_OPTIONS, TIME_GROUP_TYPE_OPTIONS } from '../../../config';
import { conditionInsight, getInsightDataFieldDetail } from 'services/enterprise';
import { opValue, seriesValue, IChartProps } from './config';

const mrl = { marginLeft: 5, marginRight: 5 };

export function RangeInput({
  rangeInput,
  index,
  setRangeInput,
}: {
  rangeInput: string[];
  index: number;
  setRangeInput: (v: string[]) => void;
}) {
  const [count, setCount] = useState('');
  return (
    <Tooltip
      title={`自定义区间(请输入数字，用英文逗号,分隔。如填写8，则代表分隔区间(-无穷,8),(8,无穷)。
      如填写2,4,5则代表区间(-无穷,2),(2,4),(4,5),(5,无穷)依次轮推。恢复默认区间则直接输入空即可。`}
    >
      <Input.Search
        style={{ width: '150px' }}
        value={count}
        onChange={(e: { target: { value: string } }) => {
          setCount(e.target.value);
        }}
        onSearch={() => {
          if (count === undefined || count === '') {
            const newRangeInput = [...rangeInput];
            newRangeInput[index] = '';
            setRangeInput(newRangeInput);
            return;
          }
          const rangeItems = (count as string).split(',').map((item) => parseInt(item, 10));
          rangeItems.push(100000000);
          rangeItems.unshift(-100000000);
          const range = [];
          for (let i = 1; i < rangeItems.length; i++) {
            const rangeInt = rangeItems[i];
            if (Number.isNaN(rangeInt)) {
              message.error('分隔区间只能包含数字和,');
              return;
            }
            if (rangeInt < rangeItems[i - 1]) {
              message.error('分隔区间必须由小到大');
              return;
            }
            range.push({
              start_value: rangeItems[i - 1],
              end_value: rangeInt,
            });
          }
          const newRangeInput = [...rangeInput];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newRangeInput[index] = range;
          setRangeInput(newRangeInput);
        }}
        size='small'
      ></Input.Search>
    </Tooltip>
  );
}

export function TimeGroupSelsct({
  timeType,
  index,
  setTimeTypes,
}: {
  timeType: string[];
  index: number;
  setTimeTypes: (v: string[]) => void;
}) {
  return (
    <Tooltip title='选择时间聚合方式'>
      <Select
        style={{ width: 70, ...mrl }}
        value={get(timeType, `${index}`, 'MONTH')}
        size='small'
        onChange={(v) => {
          const newType = [...timeType];
          newType[index] = v;
          setTimeTypes(newType);
        }}
      >
        {map(TIME_GROUP_TYPE_OPTIONS, (option) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Select.Option value={option.value} key={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Tooltip>
  );
}

export function ChartTypeSelect({
  chartTypes,
  index,
  setChartTypes,
}: {
  chartTypes: string[];
  index: number;
  setChartTypes: (v: string[]) => void;
}) {
  const allowChartTypeList = ['verticalBar', 'horizontalBar', 'doughnut'];
  const renderChartTypeList = filter(TOTAL_CHART_TYPE, (chartType) => includes(allowChartTypeList, chartType.value));
  return (
    <Radio.Group
      style={mrl}
      value={get(chartTypes, `${index}`, 'verticalBar')}
      size='small'
      onChange={(v) => {
        const newType = [...chartTypes];
        newType[index] = v.target.value;
        setChartTypes(newType);
      }}
    >
      {map(renderChartTypeList, (chartType) => (
        <Tooltip title={`切换成${chartType.label}`} key={chartType.value}>
          <Radio.Button value={chartType.value}>
            <LegacyIcon type={chartType.icon} rotate={chartType.value === 'horizontalBar' ? 90 : 0} />
          </Radio.Button>
        </Tooltip>
      ))}
    </Radio.Group>
  );
}

export function OrderSlect({
  orderTypes,
  index,
  setOrderTypes,
}: {
  orderTypes: string[];
  index: number;
  setOrderTypes: (v: string[]) => void;
}) {
  return (
    <Tooltip title='选择排序方式'>
      <Select
        style={{ width: 150, ...mrl }}
        value={get(orderTypes, `${index}`, 'TAG_RESULT|ASC')}
        size='small'
        onChange={(v) => {
          const newType = [...orderTypes];
          newType[index] = v;
          setOrderTypes(newType);
        }}
      >
        {map(ORDER_OPTIONS, (option) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Select.Option value={option.value} key={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Tooltip>
  );
}

export function useChartGroup(props: IChartProps) {
  // 标记当前是第几个Chart被点击
  const [index, setIndex] = useState(0);
  const {
    contrastChartData,
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
    // eslint-disable-next-line no-use-before-define
  } = useGroupChartItemDetail(props, index);
  const { setChartData, chartData } = props;
  // 处理Chart的type类型
  const [chartTypes, setChartTypes] = useState([]);
  // 处理Chart的排序方式
  const [orderTypes, setOrderTypes] = useState([]);
  // 处理Chart的时间区间
  const [timeType, setTimeTypes] = useState([]);
  // 处理Chart的输入范围区间
  const [rangeInput, setRangeInput] = useState([]);
  // 处理Chart的刷新时的loading
  const [loading, setLoading] = useState([]);
  // 处理Chart刷新的接口回调
  const refreshChart = async () => {
    const newLoading = [...loading];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newLoading[index] = true;
    setLoading(newLoading);
    // 自定义画像维度
    // eslint-disable-next-line camelcase
    const { is_contrast, pkgId, field_type, is_tgi } = chartData[index];
    const params = {
      pkg_inst_id: pkgId,
      is_tgi: chartData[index].is_tgi,
      insight_result_show: [
        {
          is_default: timeType[index] || rangeInput[index] ? 0 : 1,
          date_agg_type: timeType[index],
          level_values: rangeInput[index],
          tag_id: chartData[index].tag_id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          order_field: orderTypes[index] && orderTypes[index].split('|')[0],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          order_type: orderTypes[index] && orderTypes[index].split('|')[1],
        },
      ],
    };
    if (drill) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params.filter_condition = {
        logic: 'AND',
        items: drill,
      };
    }
    const [res, err] = await conditionInsight(params);
    if (err) {
      message.error(err.message);
      return;
    }
    const newChartData = [...chartData];
    const ret = get(res, 'ret.0') as any;
    // eslint-disable-next-line camelcase
    ret.field_type = field_type;
    // eslint-disable-next-line camelcase
    ret.is_tgi = is_tgi;
    // eslint-disable-next-line camelcase
    ret.is_contrast = is_contrast;
    ret.pkgId = pkgId;
    newChartData[index] = ret;
    setChartData(newChartData);
    const afterNewLoading = [...loading] as any;
    afterNewLoading[index] = false;
    setLoading(afterNewLoading);
  };
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    chartData.length && refreshChart();
  }, [orderTypes, timeType, rangeInput]);
  return {
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
    index,
    chartData,
    contrastChartData,
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
  };
}

export function useGroupChartItemDetail(props: any, index: number) {
  const { chartData, contrastChartData, fetchChartData, saveData } = props;
  // 点击详情弹窗的展示
  const [showDetail, setShowDetail] = useState(false);
  // 点击详情弹窗的数据 table的页脚
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // 点击详情弹窗的数据
  const [detailData, setDetailData] = useState([]);
  // 点击Chart item时menu的控制
  const [mouseDropdownVisible, setMouseDropdownVisible] = useState(false);
  // 点击menu之后的定位数据以及一起其他数据比如index
  const [drillParams, setDrillParams] = useState({
    position: {},
  });
  // 按住Shift点击Chart item时记录点击的多个数据
  const [selectList, setSelectLists] = useState([]);
  const listRef = useRef({});
  const [tableLoding, setTableLoading] = useState(false);
  // 点击Chart item时记录点击的数据
  const [drill, setDrill] = useState([]);
  // 处理menu消失
  document.addEventListener('click', () => {
    setMouseDropdownVisible(false);
  });
  // 点击Chart item时的回调
  const handleDrill = (drillParamss: any, index: number) => {
    setDrillParams({
      ...drillParamss,
      index,
    });
    if (drillParamss.isMulti) {
      const selectListCopy = cloneDeep(listRef.current) as any;
      if ((selectListCopy[index] || []).indexOf(drillParamss.name) > -1) return;
      if (selectListCopy[index]) {
        selectListCopy[index].push(drillParamss.name);
      } else {
        selectListCopy[index] = [drillParamss.name];
      }
      setSelectLists(selectListCopy);
      listRef.current = selectListCopy;
      setMouseDropdownVisible(false);
    } else {
      setMouseDropdownVisible(true);
    }
  };
  // 获取详情时方法
  const fetchDetail = async (pageIndex: number, pageSize: number) => {
    setTableLoading(true);
    console.log(saveData);
    const params = {
      pkg_inst_id: chartData[index].pkgId,
      tag_ids: saveData.tags.map((item: any) => get(item, 'tag_id')),
    } as any;
    if (drill && drill.length > 0) {
      params.filter_condition = {
        logic: 'AND',
        items: drill,
      };
    }
    const [res, err] = await getInsightDataFieldDetail({
      page_index: pageIndex || pagination.current,
      page_size: pageSize || pagination.pageSize,
      ...params,
    });
    if (err) {
      message.error(err.message);
      return;
    }
    setPagination({
      current: pageIndex || pagination.current,
      pageSize: pageSize || pagination.pageSize,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      total: get(res, 'total_num'),
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setDetailData(get(res, 'data_result'));
    setTableLoading(false);
  };
  // 点击Chart Item的的menu config
  const TOTAL_MENU_DATA = [
    {
      key: 'onlyKeep',
      name: '只保留',
      onClick: () => {
        setMouseDropdownVisible(false);
        const drillCopy = cloneDeep(drill) as any;
        const addItem = {
          op: opValue(chartData, index, 'keep'),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: seriesValue(chartData, index, drillParams.name),
          id: chartData[index].tag_id,
          label: get(chartData[index], 'tag_name'),
        };
        drillCopy.push(addItem);
        setDrill(drillCopy);
      },
    },
    {
      key: 'remove',
      name: '只排除',
      onClick: () => {
        setMouseDropdownVisible(false);
        const drillCopy = cloneDeep(drill) as any;
        const addItem = {
          op: opValue(chartData, index, 'remove'),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: seriesValue(chartData, index, drillParams.name),
          id: get(chartData[index], 'tag_id'),
          label: get(chartData[index], 'tag_name'),
        };
        drillCopy.push(addItem);
        setDrill(drillCopy);
      },
    },
    {
      key: 'detail',
      name: '查看明细',
      onClick: () => {
        setMouseDropdownVisible(false);
        setShowDetail(true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fetchDetail(undefined, undefined);
      },
    },
  ];
  useEffect(() => {
    fetchChartData([], false, drill);
  }, [drill]);
  return {
    contrastChartData,
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
  };
}
