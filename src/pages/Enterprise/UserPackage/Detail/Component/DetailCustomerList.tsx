import React from 'react';
import { CustomerListCard, useCustomerListCard } from './CustomerListCard';

export function DetailCustomerList({ taskId, instanceId, dataType, common: { panshiAuthMap } }: any) {
  const customerListCardState = useCustomerListCard({
    taskId,
    instanceId,
    dataType,
  });

  const availableForDownloadPackageInstanceDetailExtendField =
    panshiAuthMap?.enterprisePackageManage?.availableForDownloadPackageInstanceDetailExtendField;

  return (
    <>
      <div className='mb15'>
        <CustomerListCard
          {...customerListCardState}
          instanceId={instanceId}
          availableForDownloadPackageInstanceDetailExtendField={availableForDownloadPackageInstanceDetailExtendField}
        />
      </div>
    </>
  );
}
DetailCustomerList.displayName = 'DetailCustomerList';
