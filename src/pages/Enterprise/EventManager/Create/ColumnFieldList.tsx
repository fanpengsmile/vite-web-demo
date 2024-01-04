import React, { useEffect, useState } from 'react';
import { Card, Table, Select, Input, Checkbox } from 'antd';
import { cloneDeep } from 'lodash';
import { MenuOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { propertyTypeOptions, staticTypeOptions, fieldTypeOptions } from '../config';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function ColumnFieldList({ data, setImportData, mode }: any) {
  const isDetailDisabled = mode === 'detail';
  const setDataHandle = (index: number, value: string, key: string, deleteKey: string) => {
    const copy = cloneDeep(data);
    copy[index][key] = value;
    if (deleteKey) {
      delete copy[index][deleteKey];
    }
    delete copy[index][deleteKey];
    setImportData(copy);
  };
  const [inputId, setInputId] = useState('');
  const InputElement = ({ index, keyValue, value, disabled = false }: any) =>
    data[index][keyValue + index] ? (
      <Input
        defaultValue={value}
        id={keyValue + index}
        disabled={isDetailDisabled}
        onBlur={(e) => {
          setDataHandle(index, e.target.value, keyValue, keyValue + index);
        }}
        style={{ width: '200px' }}
      ></Input>
    ) : (
      <Input
        disabled={isDetailDisabled || disabled}
        onFocus={() => {
          const copy = cloneDeep(data);
          copy[index][keyValue + index] = true;
          setImportData(copy);
          setInputId(keyValue + index);
        }}
        value={value}
        style={{ width: '200px' }}
      ></Input>
    );
  useEffect(() => {
    const input = document.getElementById(inputId);
    if (input) {
      input.focus();
    }
  }, [inputId]);
  const columns = [
    {
      key: 'sort',
      width: 120,
      title: '排序',
    },
    {
      title: '上线',
      dataIndex: 'is_show',
      width: 100,
      render: (v: number, record: any, index: number) => {
        return (
          <Checkbox
            checked={v === undefined ? true : !!v}
            disabled={isDetailDisabled}
            onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setDataHandle(index, e.target.checked ? 1 : 0, 'is_show');
            }}
          ></Checkbox>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'property_id',
      width: 120,
      render: (v: number, record: any, index: number) => {
        return (
          <>
            <CloseCircleOutlined
              onClick={() => {
                if (isDetailDisabled) {
                  return;
                }
                const copy = cloneDeep(data);
                copy.splice(index, 1);
                setImportData(copy);
              }}
              style={{
                fontSize: '20px',
                color: isDetailDisabled ? 'gray' : 'red',
                marginRight: '10px',
                cursor: isDetailDisabled ? 'no-drop' : 'pointer',
              }}
            />
            {index === data.length - 1 ? (
              <PlusCircleOutlined
                onClick={() => {
                  if (isDetailDisabled) {
                    return;
                  }
                  const copy = cloneDeep(data);
                  copy.push({});
                  setImportData(copy);
                }}
                style={{
                  fontSize: '20px',
                  cursor: isDetailDisabled ? 'no-drop' : 'pointer',
                  color: isDetailDisabled ? 'gray' : '#666',
                }}
              />
            ) : null}
          </>
        );
      },
    },
    {
      title: '英文名',
      dataIndex: 'field_en_name',
      width: 220,
      render: (v: number, record: any, index: number) => {
        // eslint-disable-next-line camelcase
        const { field_source_key } = record;
        // eslint-disable-next-line camelcase
        return <InputElement index={index} value={v || field_source_key} keyValue='field_en_name'></InputElement>;
      },
    },
    {
      title: '中文名',
      dataIndex: 'field_name',
      width: 220,
      render: (v: number, record: any, index: number) => {
        return <InputElement index={index} value={v} keyValue='field_name'></InputElement>;
      },
    },
    {
      title: '原字段名',
      dataIndex: 'field_source_key',
      width: 200,
      render: (v: number, record: any, index: number) => {
        return <InputElement index={index} value={v} keyValue='field_source_key'></InputElement>;
      },
    },
    {
      title: '数据类型',
      dataIndex: 'field_type',
      width: 200,
      render: (v: number, record: any, index: number) => {
        return (
          <Select
            value={v || 'DATE'}
            style={{ width: '120px' }}
            options={fieldTypeOptions}
            disabled={isDetailDisabled}
            onChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setDataHandle(index, value, 'field_type');
            }}
          />
        );
      },
    },
    {
      title: '聚合类型',
      dataIndex: 'property_type',
      width: 135,
      render: (v: number, record: any, index: number) => {
        return (
          <Select
            style={{ width: '120px' }}
            options={propertyTypeOptions}
            disabled={isDetailDisabled}
            value={v || 'DIM'}
            onChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setDataHandle(index, value, 'property_type');
            }}
          ></Select>
        );
      },
    },
    {
      title: '计算脚本',
      dataIndex: 'cal_field_source_key',
      width: 250,
      render: (v: number, record: any, index: number) => {
        // eslint-disable-next-line camelcase
        const { property_type } = record;
        return (
          <InputElement
            index={index}
            value={v}
            keyValue='cal_field_source_key'
            // eslint-disable-next-line camelcase
            disabled={property_type !== 'CALCULATE'}
          ></InputElement>
        );
      },
    },
    {
      title: '统计类型',
      dataIndex: 'static_type',
      width: 180,
      render: (v: number, record: any, index: number) => {
        // eslint-disable-next-line camelcase
        const { property_type } = record;
        return (
          <Select
            // eslint-disable-next-line camelcase
            disabled={isDetailDisabled || property_type !== 'STATIC'}
            style={{ width: '120px' }}
            options={staticTypeOptions}
            value={v}
            onChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setDataHandle(index, value, 'static_type');
            }}
          ></Select>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 250,
      render: (v: number, record: any, index: number) => {
        return <InputElement index={index} value={v} keyValue='remark'></InputElement>;
      },
    },
  ];
  const Row = ({ children, ...props }: any) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        },
      ),
      transition,
      ...(isDragging
        ? {
            position: 'relative',
            zIndex: 9999,
          }
        : {}),
    };
    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if (child.key === 'sort') {
            return React.cloneElement(child, {
              children: (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{
                    touchAction: 'none',
                    cursor: 'move',
                  }}
                  {...listeners}
                />
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };
  const onDragEnd = ({ active, over }: any) => {
    if (isDetailDisabled) return;
    if (active.id !== over?.id) {
      setImportData((previous: any) => {
        const activeIndex = previous.findIndex((i: any) => i.field_source_key === active.id);
        const overIndex = previous.findIndex((i: any) => i.field_source_key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };
  return (
    <Card title='字段配置' className='mb15'>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={data.map((i: any) => i.field_source_key)} strategy={verticalListSortingStrategy}>
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            scroll={{ x: '100%' }}
            pagination={false}
            rowKey='field_source_key'
            columns={columns}
            dataSource={data}
          />
        </SortableContext>
      </DndContext>
    </Card>
  );
}
ColumnFieldList.displayName = 'ColumnFieldList';
