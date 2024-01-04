import React, { ReactNode } from 'react';
import { Watermark } from 'antd';
import { useStore } from 'store';

const WatermarkWrap: React.FC<{
  children?: ReactNode;
  offset?: [number, number];
  gap?: [number, number];
  rotate?: number;
}> = ({ gap, offset, rotate, children }) => {
  const curStaffName = useStore((state) => state.currentStaffName);

  return (
    <Watermark
      content={curStaffName || 'cem-mark'}
      gap={gap || [100, 250]}
      offset={offset || [158, 201]}
      rotate={rotate || -40}
      zIndex={9999} // 为了统一覆盖dialog等高zIndex图层
      font={{ color: 'rgba(0, 0, 0, 0.05)' }} // 水印效果2，最新版效果
      // gap={gap || [180, 320]} // 备选效果
      // offset={offset || [100, 220]}  // 备选效果
      // font={{ color: 'rgba(245, 245, 245, 0.9)', fontSize: 18 }} // 水印效果1，可选效果
      // font={{ color: '#f5f5f5', fontSize: 18 }} // 水印效果3，可选择版本
      // font={{ color: 'red', fontSize: 18 }} // 水印效果4，调试用
    >
      {children}
    </Watermark>
  );
};

export default WatermarkWrap;
