/**
 * 标签字典列表
 *
 * @author: peytonfan
 */
import React from 'react';
import { isEmpty, trim, filter, includes, get } from 'lodash';
import { Link } from 'react-router-dom';
// import '@ant-design/compatible/assets/index.css'
import { Spin, Card, Button, Form, message } from 'antd';
import { useSafeState, useMemoizedFn } from 'ahooks';
import { SearchForm } from './SearchForm';
import { ListTable } from './ListTable';
import { ImportDialog, useImportDialog } from './ImportDialog';
import { useTagDirList, useRequestExportTagConfig, useRequestModifyTagStatus } from '../../base/cgi';

export function TagDictList({ common: { panshiAuthMap }, fromSystem }: any) {
  // eslint-disable-next-line no-use-before-define
  const { form, tableDataSource, handleDataSourceInit, handleSearch, handleReset } = useTableDataSource();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { tagDirList, tagDirListLoading, refresh } = useTagDirList(
    ({ tagMetaList }) => {
      handleDataSourceInit(tagMetaList);
    },
    'ALL',
    true,
  );
  const { requestModifyTagStatusLoading, runRequestModifyTagStatus } = useRequestModifyTagStatus(
    (newStatus: string) => {
      refresh();
      message.success(`目标标签已${newStatus === 'ONLINE' ? '上线' : '下线'}`);
    },
  );
  const { showImportDialog, ...restStateForImportDialog } = useImportDialog({
    afterImportSuccess: refresh,
  });
  const isDictEditable = panshiAuthMap?.portraitMeta?.tagDictEditAuth;
  const [selectedTagIdList, setSelectedTagIdList] = useSafeState<number>();
  const rowSelection = {
    selectedRowKeys: selectedTagIdList,
    onChange: (selectedRowKeys: number) => {
      setSelectedTagIdList(selectedRowKeys);
    },
  };
  const handleBatchModifyTagStatus = useMemoizedFn((newStatus) => {
    runRequestModifyTagStatus(selectedTagIdList, newStatus);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSelectedTagIdList();
  });

  const handleBtnOnlineClick = (tagId: number) => {
    runRequestModifyTagStatus([tagId], 'ONLINE');
  };

  const handleBtnOfflineClick = (tagId: number) => {
    runRequestModifyTagStatus([tagId], 'OFFLINE');
  };

  const handleImportBtnClick = () => {
    showImportDialog();
  };

  const { requestExportTagConfigLoading, runRequestExportTagConfig } = useRequestExportTagConfig(
    (downloadUrl: string) => {
      window.location.href = downloadUrl;
    },
  );

  const loading = !!tagDirListLoading || !!requestModifyTagStatusLoading;

  return (
    <>
      <SearchForm form={form} tagDirList={tagDirList} triggerSearch={handleSearch} triggerReset={handleReset} />
      <Card>
        <div className='mb15'>
          {[
            isDictEditable ? (
              <Button key='create' type='primary' className='mr10'>
                <Link to={`/enterprise/portrait_meta/tag_dict/create`}>新增标签</Link>
              </Button>
            ) : null,
            isDictEditable ? (
              <Button
                key='batchOnline'
                type='primary'
                className='mr10'
                disabled={isEmpty(selectedTagIdList)}
                onClick={() => {
                  handleBatchModifyTagStatus('ONLINE');
                }}
              >
                批量上线
              </Button>
            ) : null,
            isDictEditable ? (
              <Button
                key='batchOffline'
                type='primary'
                className='mr10'
                disabled={isEmpty(selectedTagIdList)}
                onClick={() => {
                  handleBatchModifyTagStatus('OFFLINE');
                }}
              >
                批量下线
              </Button>
            ) : null,
            isDictEditable ? (
              <Button type='primary' key='import' className='mr10' onClick={handleImportBtnClick}>
                批量导入
              </Button>
            ) : null,
            isDictEditable ? (
              <Button
                type='primary'
                key='export'
                className='mr10'
                loading={requestExportTagConfigLoading}
                onClick={runRequestExportTagConfig}
              >
                批量导出
              </Button>
            ) : null,
          ]}
        </div>

        <Spin spinning={loading}>
          <ListTable
            dataSource={tableDataSource}
            isDictEditable={isDictEditable}
            onBtnOnlineClick={handleBtnOnlineClick}
            onBtnOfflineClick={handleBtnOfflineClick}
            rowSelection={rowSelection}
            fromSystem={fromSystem}
            tagDirList={tagDirList}
          />
        </Spin>
      </Card>
      <ImportDialog {...restStateForImportDialog} />
    </>
  );
}

TagDictList.displayName = 'TagDictList';

function useTableDataSource() {
  const [form] = Form.useForm();
  const [tagMetaList, setTagMetaList] = useSafeState();
  const [tableDataSource, setTableDataSource] = useSafeState();
  const [searchParams, setSearchParams] = useSafeState();

  const buildTableDataSource = (currentTagMetaList: any, currentSearchParams: any) => {
    const { tagName: originTagNameParam, tagDirIdArr: tagDirIdArrParam, tagGroup } = currentSearchParams ?? {};
    const tagNameParam = trim(originTagNameParam);

    const filteredTagMetaList = filter(currentTagMetaList, (tag) => {
      if (!!tagNameParam && !includes(tag.tag_name, tagNameParam)) {
        return false;
      }

      if (tagGroup && get(tag, 'tag_group') !== tagGroup) {
        return false;
      }
      if (!isEmpty(tagDirIdArrParam)) {
        if (!!tagDirIdArrParam[0] && tag.firstLevelDirId !== tagDirIdArrParam[0]) {
          return false;
        }

        if (!!tagDirIdArrParam[1] && tag.secondLevelDirId !== tagDirIdArrParam[1]) {
          return false;
        }
      }

      return true;
    });

    setTableDataSource(filteredTagMetaList.sort((a, b) => b.tag_dir_id - a.tag_dir_id) as any);
  };

  const handleDataSourceInit = useMemoizedFn((tagMetaListFromServer) => {
    setTagMetaList(tagMetaListFromServer);
    buildTableDataSource(tagMetaListFromServer, searchParams);
  });

  const handleSearch = useMemoizedFn(() => {
    const newSearchParams = form.getFieldsValue();
    setSearchParams(newSearchParams);
    buildTableDataSource(tagMetaList, newSearchParams);
  });

  const handleReset = useMemoizedFn(() => {
    form.resetFields();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSearchParams();
    buildTableDataSource(tagMetaList, {});
  });

  return {
    form,
    tableDataSource,
    handleDataSourceInit,
    handleSearch,
    handleReset,
  };
}
