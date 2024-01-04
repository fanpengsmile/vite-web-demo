import React, { useEffect } from 'react';
import { Select } from 'antd';
import { get, reduce, keys, map } from 'lodash';
import { getFtList, getOrganizationForEnt } from 'services/enterprise';

interface IFT {
  centerId: number;
  centerName: string;
  departmentId: number;
  departmentName: string;
  name: string;
  nameZh: string;
  value: string;
}

interface IProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  staffName?: string;
  onCenterIdChange?: (v: number) => void;
}

export default function FtSelect(props: IProps) {
  const [teamList, setTeamList] = React.useState([]);
  const [ftListLoading, setFtListLoading] = React.useState(false);
  const { disabled, placeholder, value, onChange, staffName, onCenterIdChange } = props;
  const fetch = async () => {
    setFtListLoading(true);
    const [data, err] = await getFtList();
    if (!err) {
      const cmbFt = get(data, 'cmb_ft', {});
      const ftlist = reduce(
        cmbFt,
        (lastResult, item, departmentId) => {
          let result = lastResult;
          const departmentName = get(item, 'departmentName', '');
          const centerMap = get(item, 'center', {});

          if (keys(centerMap).length > 0) {
            const centerList = map(centerMap, (centerName, centerId) => ({
              departmentName,
              departmentId,
              centerId,
              centerName,
              value: `${departmentName}/${centerName}`,
            }));
            result = result.concat(centerList as any);
          }

          return result;
        },
        [],
      );
      setTeamList(ftlist);
      setFtListLoading(false);
    }
  };
  useEffect(() => {
    fetch();
    if (staffName) {
      getOrganizationForEnt(staffName).then((res) => {
        const { departmentName = '', centerName = '', centerId } = res[0] || {};
        const ft = departmentName && centerName ? `${departmentName}/${centerName}` : '';
        if (ft) {
          // eslint-disable-next-line no-unused-expressions
          onChange && onChange(ft);
          // eslint-disable-next-line no-unused-expressions
          onCenterIdChange && onCenterIdChange(centerId);
        }
      });
    }
  }, []);
  return (
    <Select
      value={value}
      onChange={(v) => {
        // eslint-disable-next-line no-unused-expressions
        onCenterIdChange && onCenterIdChange(parseInt(v, 10));
        // eslint-disable-next-line no-unused-expressions
        onChange && onChange(v);
      }}
      disabled={disabled}
      showSearch
      placeholder={placeholder || '请选择归属团队'}
      filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      loading={ftListLoading}
      allowClear={true}
    >
      {map(teamList, (ft: IFT) => (
        <Select.Option key={ft.centerId}>{ft.value}</Select.Option>
      ))}
    </Select>
  );
}
