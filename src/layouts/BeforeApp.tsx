import React, { memo, useEffect, useRef } from 'react';
import { useStore } from 'store';
import { getCurrentStaffName } from 'services/common';

const BeforeApp = () => {
  const setCurrentStaffName = useStore((state) => state.setCurrentStaffName);
  const isFetchStaffNum = useRef(0);

  const fetchCurrentStaffName = async () => {
    const [res, err] = await getCurrentStaffName();
    isFetchStaffNum.current += 1;
    if (!err) {
      console.log('🚀 ~ 获取当前用户staffName:', res);
      setCurrentStaffName(res);
      return;
    }
    if (isFetchStaffNum.current < 3) {
      setTimeout(() => {
        fetchCurrentStaffName();
      }, 3000);
    }
    if (isFetchStaffNum.current === 3) {
      console.error('🚀 ~ 获取当前用户staffName 3次都失败');
      // TODO:可能需要给用户一个提示
    }
  };

  useEffect(() => {
    fetchCurrentStaffName();
  }, []);

  return <></>;
};
export default memo(BeforeApp);
