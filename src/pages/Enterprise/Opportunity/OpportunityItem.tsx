import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from 'store';
import { Alert, Typography, message } from 'antd';
import { getUrlSearchParams, usePvReport } from '../Common/util';
import { CompanyDetail } from './Component/Company/CompanyDetail';
import { useSafeState } from 'ahooks';
import { decodeVerifyToken, getCompanyEntInfo, getCompanyByCreditNo } from 'services/enterprise';
import { get } from 'lodash';

function OpportunityItem(props: any) {
  const { meta } = props;
  const initEnterpriseState = useStore((state) => state.initEnterpriseState);
  const panshiAuthMap = get(initEnterpriseState, 'common.panshiAuthMap');
  const location = useLocation();
  const [initUrlParams] = useSafeState(() => getUrlSearchParams(location));
  const verifyToken = initUrlParams?.verify_token;
  const [entInfo, setEntInfo] = useState();
  const [name, setName] = useState('');
  const ErrorMessage = () => (
    <Alert
      message={
        <span>
          鉴权参数异常，如有疑问请联系
          <Typography.Text strong>ericpqzhu(朱普庆)</Typography.Text>
        </span>
      }
      type='error'
    />
  );
  const pageAuth = get(panshiAuthMap, 'enterpriseNationwideExtract.pageAuth');
  const fetchComponentEntInfo = async (name: string, code: string) => {
    let componentName = name;
    if (!name && code) {
      const [res, err] = await getCompanyByCreditNo({
        credit_no: code,
      });
      if (err) {
        message.error(err.message);
        return;
      }
      componentName = res?.company || '';
    }
    const [entRes] = await getCompanyEntInfo({
      name: componentName,
    });
    setEntInfo(entRes?.ent_info || {});
  };
  usePvReport(meta, location.pathname);
  useEffect(() => {
    if (!pageAuth) return;
    decodeVerifyToken({ vtk: verifyToken }).then((res: any) => {
      if (res[0]) {
        const time = res[0]?.time;
        const system = res[0]?.system;
        if (Date.now() - parseInt(time, 10) > 1000 * 10 || system !== 'cem') {
          return;
        }
        setName(res[0]?.name);
        fetchComponentEntInfo(res[0]?.name, res[0]?.credit_code);
      }
    });
  }, []);
  if (!entInfo) {
    return <ErrorMessage></ErrorMessage>;
  }

  return <CompanyDetail desensitize={true} entInfo={entInfo} show={true} name={name}></CompanyDetail>;
}
OpportunityItem.displayName = 'ListContainer';

export default OpportunityItem;
