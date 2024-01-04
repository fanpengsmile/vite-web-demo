import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';
import react from '@vitejs/plugin-react';
import svgr from '@honkhonk/vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import vitePluginImp from 'vite-plugin-imp';

export default (params) => ({
  base: '/',
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      configs: path.resolve(__dirname, './src/configs'),
      layouts: path.resolve(__dirname, './src/layouts'),
      store: path.resolve(__dirname, './src/store'),
      pages: path.resolve(__dirname, './src/pages'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
      services: path.resolve(__dirname, './src/services'),
      router: path.resolve(__dirname, './src/router'),
      hooks: path.resolve(__dirname, './src/hooks'),
      types: path.resolve(__dirname, './src/types'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 如需自定义组件其他 token, 在此处配置
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    // createStyleImportPlugin({
    //   resolves: [AntdResolve()]
    // }),
    vitePluginImp({
      libList: [
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
        },
        {
          libName: 'antd',
          // style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
    svgr(),
    react(),
    params.mode === 'mock' &&
      viteMockServe({
        mockPath: './mock',
        localEnabled: true,
      }),
    // 放在所有插件最后
    visualizer({
      filename: 'report.html',
      open: true,
      // template: 'treemap', // 'sunburst'|'network'|'raw-data'|'list'|'treemap' 默认treemap
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    cssCodeSplit: false,
  },

  server: {
    host: '0.0.0.0',
    port: 3003,
    proxy: {
      '/api': {
        // 用于开发环境下的转发请求
        // 更多请参考：https://vitejs.dev/config/#server-proxy
        target: 'http://127.0.0.1:3000',
        // target: 'http://busniess-oppty.testsite.woa.com',
        changeOrigin: true,
      },
    },
  },
});
