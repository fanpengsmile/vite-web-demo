/**
 * 标签字典列表
 *
 * @author: peytonfan
 */
import React from 'react';
import { trim, filter, includes, orderBy } from 'lodash';
import { Link } from 'react-router-dom';
// import '@ant-design/compatible/assets/index.css'
import { Spin, Card, Button, Form } from 'antd';
import { useSafeState, useMemoizedFn } from 'ahooks';
import { SearchForm } from './SearchForm';
import { ListTable } from './ListTable';
import { useEventManagerList, useRequestModifyEventStatus } from '../../base/cgi';

export function EventManageList({ common: { panshiAuthMap } }: any) {
  // eslint-disable-next-line no-use-before-define
  const { form, tableDataSource, handleDataSourceInit, handleSearch, handleReset } = useTableDataSource();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { eventListLoading, refreshEventList } = useEventManagerList((eventList) => {
    handleDataSourceInit(eventList);
  });
  const { requestModifyEventStatusLoading, runRequestModifyEventStatus } =
    useRequestModifyEventStatus(refreshEventList);

  const isEventEditable = panshiAuthMap?.portraitMeta?.eventManageEditAuth;

  // const windowSize = useSize(document.body)

  const handleBtnOnlineClick = (eventId: number) => {
    runRequestModifyEventStatus(eventId, 'ONLINE');
  };

  const handleBtnOfflineClick = (eventId: number) => {
    runRequestModifyEventStatus(eventId, 'OFFLINE');
  };

  const loading = !!eventListLoading || !!requestModifyEventStatusLoading;

  return (
    <>
      <SearchForm form={form} triggerSearch={handleSearch} triggerReset={handleReset} />
      <Card>
        <div className='mb15'>
          {isEventEditable && (
            <Button key='create' type='primary' className='mr10'>
              <Link to={`/enterprise/portrait_meta/event_manage/create`}>新增数据源</Link>
            </Button>
          )}
        </div>

        <Spin spinning={loading}>
          <ListTable
            dataSource={tableDataSource}
            isEventEditable={isEventEditable}
            onBtnOnlineClick={handleBtnOnlineClick}
            onBtnOfflineClick={handleBtnOfflineClick}
          />
        </Spin>
      </Card>
    </>
  );
}

EventManageList.displayName = 'EventManageList';

function useTableDataSource() {
  const [form] = Form.useForm();
  const [eventList, setEventList] = useSafeState();
  const [tableDataSource, setTableDataSource] = useSafeState();
  const [searchParams, setSearchParams] = useSafeState();

  const buildTableDataSource = (currentEventList: any, currentSearchParams: any) => {
    const { eventName: originEventNameParam } = currentSearchParams ?? {};
    const eventNameParam = trim(originEventNameParam);

    const filteredEventList = filter(currentEventList, (event) => {
      if (!!eventNameParam && !includes(event.event_name, eventNameParam)) {
        return false;
      }

      return true;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTableDataSource(filteredEventList);
  };

  const handleDataSourceInit = useMemoizedFn((eventListFromServer) => {
    const initEventList = orderBy(eventListFromServer, ['event_id'], ['desc']);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setEventList(initEventList);
    buildTableDataSource(initEventList, searchParams);
  });

  const handleSearch = useMemoizedFn(() => {
    const newSearchParams = form.getFieldsValue();
    setSearchParams(newSearchParams);
    buildTableDataSource(eventList, newSearchParams);
  });

  const handleReset = useMemoizedFn(() => {
    form.resetFields();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSearchParams();
    buildTableDataSource(eventList, {});
  });

  return {
    form,
    tableDataSource,
    handleDataSourceInit,
    handleSearch,
    handleReset,
  };
}
