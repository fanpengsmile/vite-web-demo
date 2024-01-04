import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useMemoizedFn } from 'ahooks';
import ErrorPage from 'components/ErrorPage';
import { RumCaptureException } from 'utils/enterpriseRum';

const WithErrorBoundary = ({ children }: React.PropsWithChildren<any>) => {
  const [hasError, setHasError] = useState(false);
  if (children === undefined) {
    return <></>;
  }
  /* 组件出现异常后的回调方法 */
  const handleError = useMemoizedFn((error: Error) => {
    setHasError(true);
    /* rum上报异常 */
    RumCaptureException(error);
  });
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorPage code={-1} />} onError={handleError}>
      {!hasError && children}
    </ErrorBoundary>
  );
};
export default WithErrorBoundary;
