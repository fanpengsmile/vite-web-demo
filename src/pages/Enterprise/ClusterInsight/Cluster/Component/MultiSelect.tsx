import React, { useCallback } from 'react';
import { Button, Tag } from 'antd';
import { cloneDeep, get, isEmpty, map } from 'lodash';
import { opValue } from './Charts/config';

const containerStyle = {
  maxWidth: 500,
  zIndex: 100,
  position: 'absolute',
  top: 5,
  right: 5,
  padding: '10px 20px',
  borderRadius: 10,
  border: '1px solid #91d5ff',
  backgroundColor: 'rgba(230, 247, 255, 0.85)',
};

const tagContainerStyle = {};

const buttonContainerStyle = {
  textAlign: 'center',
};

const tagStyle = {
  marginBottom: 5,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export default function DrillKeyMultiSelector(props: any) {
  const { setSelectLists, selectList, index, listRef, drill, setDrill, chartData } = props;
  const multiSelectDrillKeyList = selectList[index];
  const handleDelete = (key: string) => {
    const updateList = selectList[index].filter((item: any) => item !== key);
    const selectListCopy = cloneDeep(selectList);
    selectListCopy[index] = updateList;
    setSelectLists(selectListCopy);
    listRef.current = selectListCopy;
  };
  const handleClear = () => {
    const selectListCopy = cloneDeep(selectList);
    selectListCopy[index] = undefined;
    setSelectLists(selectListCopy);
    listRef.current = selectListCopy;
  };
  const handleDrill = useCallback((type) => {
    const drillCopy = cloneDeep(drill);
    let addItem;
    if (chartData[index].field_type === 'DOUBLE') {
      for (let i = 0; i < listRef.current[index].length; i++) {
        addItem = {
          op: opValue(chartData, index, type),
          value: selectList[index][i].replace('(', '').replace(']', '').split('~'),
          id: get(chartData[index], 'tag_id'),
          label: get(chartData[index], 'tag_name'),
        };
        drillCopy.push(addItem);
      }
    } else {
      addItem = {
        op: opValue(chartData, index, type),
        value: listRef.current[index],
        id: get(chartData[index], 'tag_id'),
        label: get(chartData[index], 'tag_name'),
      };
      drillCopy.push(addItem);
    }
    setDrill(drillCopy);
    handleClear();
  }, []);

  if (isEmpty(multiSelectDrillKeyList)) return null;
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <div style={containerStyle}>
      <div style={tagContainerStyle}>
        {map(multiSelectDrillKeyList, (key) => (
          <Tag style={tagStyle} closable onClose={() => handleDelete(key)} key={key}>
            {key}
          </Tag>
        ))}
      </div>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div style={buttonContainerStyle}>
          <Button type='primary' size='small' style={{ marginRight: 5 }} onClick={() => handleDrill('keep')}>
            只保留
          </Button>
          <Button type='primary' size='small' style={{ marginRight: 5 }} onClick={() => handleDrill('remove')}>
            排除
          </Button>
          <Button type='dashed' size='small' onClick={handleClear}>
            取消
          </Button>
        </div>
      }
    </div>
  );
}
DrillKeyMultiSelector.displayName = 'DrillKeyMultiSelector';
