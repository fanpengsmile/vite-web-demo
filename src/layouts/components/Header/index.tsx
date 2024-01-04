import React, { memo } from 'react';
import { Layout, Button, Row, Col } from 'tdesign-react';
import { Select } from 'antd';
import { ViewListIcon } from 'tdesign-icons-react';
import Style from './index.module.less';
import { useStore } from 'store';
import { tabs } from 'router/tab'
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export default memo((props: { showMenu?: boolean }) => {
  const menuCollapsed = useStore((state) => state.menuCollapsed);
  const setMenuCollapsed = useStore((state) => state.setMenuCollapsed);
  const navigate = useNavigate();
  const HeaderLeft = (
    <Row gutter={16} align='middle'>
      <Col>
        <Button shape='square' size='large' variant='text' onClick={() => setMenuCollapsed(!menuCollapsed)}>
          <ViewListIcon />
        </Button>
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="快捷访问Tab"
          allowClear
          size='small'
          optionFilterProp="children"
          onChange={(value) => {
            value && navigate(value)
          }}
          options={tabs}
          filterOption={(input, option) => ((option?.label ?? '') as string).includes(input)}
          filterSort={(optionA, optionB) =>
            ((optionA?.label ?? '') as string).toLowerCase().localeCompare(
              ((optionB?.label ?? '') as string).toLowerCase()
            )
          }
        />
      </Col>
    </Row>
  );

  return (
    <Header className={Style.panel}>
      {HeaderLeft}
    </Header>
  );
});
