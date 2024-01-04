import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'layouts/index';
import 'tdesign-react/es/style/index.css';
import './styles/index.less';
import AxiosInterceptor from './hooks/axiosInterceptor';
import consoleColor from 'utils/consoleColor';
import { initEnterpriseRUM } from 'utils/enterpriseRum'
import { ConfigProvider } from 'antd';
import 'store';
import BeforeApp from 'layouts/BeforeApp';

consoleColor(import.meta.env.MODE, import.meta.env.VITE_APP_VERSION);
consoleColor('img-tag', import.meta.env.VITE_APP_IMG_TAG);
// enterprise Rum
initEnterpriseRUM()

// 主App
const renderApp = () => {
  ReactDOM.render(
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0052d9',
            borderRadius: 3,
          },
        }}
      >
        <AxiosInterceptor />
        <BeforeApp />
        <App />
      </ConfigProvider>
    </BrowserRouter>,

    document.getElementById('app'),
  );
};
renderApp();
