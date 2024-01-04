import React from 'react';
import StaffSelect, { IStaffSelectProps, SearchFunc } from './StaffSelect';
import _ from 'lodash';
import { queryStaffByName } from 'services/clueTask';
import { ResQueryStaffParams } from 'types/clueTask.type';

export default function StaffSelectWrap(props: Omit<IStaffSelectProps, 'onSearch'>) {
  const onSearch: SearchFunc = async (query: ResQueryStaffParams) => {
    const [res, err] = await queryStaffByName(query);
    if (err) {
      return [];
    }
    return res;
  };

  return <StaffSelect {...props} onSearch={onSearch} />;
}
