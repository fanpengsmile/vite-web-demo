import React from 'react';
import { useSafeState, useGetState } from 'ahooks';
import { Typography, Spin } from 'antd';
import { useRequestExtractInnerCustomer } from '../../../base/cgi';
import { eventTrackingReport } from 'services/enterprise';
import { isNil } from 'lodash';

export const PredictUserPackageSize = ({ packageSize, onPredictUserPackageSize, extractInnerCustomerLoading }: any) => {
  return isNil(packageSize) ? (
    <Spin spinning={!!extractInnerCustomerLoading}>
      <Typography.Link onClick={onPredictUserPackageSize}>开始预估</Typography.Link>
    </Spin>
  ) : (
    <span>{packageSize}</span>
  );
};
PredictUserPackageSize.displayName = 'PredictUserPackageSize';

export function usePredictUserPackageSize() {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [requestTime, setRequestTime, getRequestTime] = useGetState();
  const [packageSize, setPackageSize] = useSafeState();
  const { extractInnerCustomerLoading, runExtractInnerCustomer: originRunExtractInnerCustomer } =
    useRequestExtractInnerCustomer(
      (newPackageSize: any) => {
        setPackageSize(newPackageSize);
        // eslint-disable-next-line no-use-before-define
        reportRequestResult('success');
      },
      () => {
        // eslint-disable-next-line no-use-before-define
        reportRequestResult('failed');
      },
    );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const clearPackageSizePredictResult = () => setPackageSize();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const runExtractInnerCustomer = (...params) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setRequestTime(Date.now());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    originRunExtractInnerCustomer(...params);
  };

  return {
    packageSize,
    runExtractInnerCustomer,
    clearPackageSizePredictResult,
    extractInnerCustomerLoading,
  };

  function reportRequestResult(result: any) {
    eventTrackingReport({
      level1_module: '找企业',
      level2_module: '内部企业圈选',
      level3_module: '预估人数',
      event_type: 'button',
      event_detail: '预估人数',
      request_result: result,
      from_system: window.top === window.self ? '商机' : '其他',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request_time_spent: Date.now() - getRequestTime(),
    });
  }
}
