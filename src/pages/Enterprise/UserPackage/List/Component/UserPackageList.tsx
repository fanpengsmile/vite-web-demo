import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Space, message, Dropdown } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { usePvReport } from '../../../Common/util';
import { SearchForm } from './SearchForm';
import { useRequestGetUserPackageTaskList, useRequestDeleteUserPackageTask } from '../../../base/cgi';
import { ListTable } from './ListTable';

export function UserPackageList({
  isFromCemSystem = false,
  fromSystem,
  route,
  match,
  common: { env },
  packageListIssue = false,
}: any) {
  const { tableProps, form, search, requestUserPackageTaskListLoading, refreshUserPackageTaskList } =
    useRequestGetUserPackageTaskList();
  const { deleteUserPackageTaskLoading, runDeleteUserPackageTask } = useRequestDeleteUserPackageTask(() => {
    refreshUserPackageTaskList();
    message.success('已删除');
  });

  const handleDelete = useMemoizedFn((taskId) => {
    runDeleteUserPackageTask(taskId);
  });

  const reportBtnRealCreateClickEvent = (btnLabel: string) => {
    usePvReport(route, match, {
      event_type: 'button',
      event_detail: btnLabel,
    });
  };

  const loading = requestUserPackageTaskListLoading || deleteUserPackageTaskLoading;

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={10}>
      <SearchForm search={search} form={form} />

      <div>
        <Dropdown
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          trigger='click'
          menu={{
            items: [
              {
                key: 'extract',
                label: (
                  <Link
                    to={`/enterprise/user_package/create`}
                    onClick={() => {
                      reportBtnRealCreateClickEvent('企业圈选');
                    }}
                  >
                    标签圈选
                  </Link>
                ),
              },
              {
                key: 'upload',
                label: (
                  <Link
                    to={`/enterprise/user_package/upload`}
                    onClick={() => {
                      reportBtnRealCreateClickEvent('文件导入');
                    }}
                  >
                    文件导入
                  </Link>
                ),
              },
              {
                key: 'pkg_import',
                label: <Link to={`/enterprise/user_package/pkg_import`}>分群交并差</Link>,
              },
              {
                key: 'sql_import',
                label: <Link to={`/enterprise/user_package/sql_import`}>SQL创建</Link>,
              },
            ],
          }}
        >
          <Button
            type='primary'
            onClick={() => {
              usePvReport(route, match, {
                event_type: 'button',
                event_detail: '创建分群',
              });
            }}
          >
            创建分群
          </Button>
        </Dropdown>
      </div>

      <ListTable
        tableProps={tableProps}
        loading={loading}
        packageListIssue={packageListIssue}
        handleDelete={handleDelete}
        isFromCemSystem={isFromCemSystem}
        fromSystem={fromSystem}
        route={route}
        match={match}
        common={{ env }}
        refreshUserPackageTaskList={refreshUserPackageTaskList}
      />
    </Space>
  );
}
UserPackageList.displayName = 'UserPackageList';
