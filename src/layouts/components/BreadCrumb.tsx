import React from 'react';
import { Breadcrumb } from 'tdesign-react';
import { useStore } from 'store';
import Style from './Page.module.less';
import { useMemoizedFn } from 'ahooks';
import { useNavigate } from 'react-router-dom';

const { BreadcrumbItem } = Breadcrumb;

const BreadCrumb = ({ breadcrumbs }: { breadcrumbs?: { content: string; to?: string }[] }) => {
  const isShowBreadcrumb = useStore((state) => state.isShowBreadcrumb);

  const navigate = useNavigate();
  const onClick = useMemoizedFn((item: { content: string; to?: string }, index: number) => {
    if (breadcrumbs?.length === index + 2) {
      navigate(-1);
    } else if (breadcrumbs?.length === index + 1) {
      // return;
    } else if (item?.to) navigate(item?.to);
  });
  if (isShowBreadcrumb && Array.isArray(breadcrumbs) && breadcrumbs?.length > 0) {
    return (
      <Breadcrumb className={Style.breadcrumb}>
        {breadcrumbs?.map((item, index) => (
          // @ts-ignore
          <BreadcrumbItem key={index} onClick={() => onClick(item, index)}>
            {item.content}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    );
  }
  return <></>;
};

export default React.memo(BreadCrumb);
