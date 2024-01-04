import React from 'react';
import { List } from 'antd';

export function OptionSelectFormTitleContent(props: { content: string }) {
  const { content } = props;
  const contentItem = content.split('<br>');
  return (
    <List
      itemLayout='horizontal'
      dataSource={contentItem}
      renderItem={(item: string) => (
        <List.Item style={{ paddingBottom: '8px', paddingTop: '8px' }}>
          <List.Item.Meta
            avatar={
              <div
                style={{
                  width: '5px',
                  height: '20px',
                  color: '#3da8f5',
                  backgroundColor: '#3da8f5',
                }}
              ></div>
            }
            title={item.split(':')[0]}
            description={item.split(':')[1]}
          />
        </List.Item>
      )}
    />
  );
}
OptionSelectFormTitleContent.displayName = 'OptionSelectFormTitleContent';
