import React, { useRef } from 'react';
import { axiosInstance } from '../utils/fetch';
import { CommonError } from '../types';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { mockStaffname } from 'configs/index';

// axios拦截器放在hook里，因为这个会有react上下文，可以方便的调用路由、store、ant等
const AxiosInterceptor = () => {
  const isExecutedRef = useRef(false);

  if (isExecutedRef.current === false) {
    isExecutedRef.current = true;
    // 请求拦截器：正常
    const reqInterceptorFn = (config: AxiosRequestConfig) => {
      if (import.meta.env.MODE === 'Local') {
        config.headers = { ...config.headers, staffname: mockStaffname };
      }
      return config;
    };

    // 请求拦截器：异常
    const reqErrInterceptorFn = (error: AxiosError) => Promise.reject(error);

    // 响应拦截器：正常
    const resInterceptorFn = (res: AxiosResponse) => {
      const { data, status } = res;
      // res.config.headers是请求头   res.headers是响应头
      if (status === 200 || status === 201) {
        // 从响应头获取当前是哪个用户
        // console.log('🚀 ~ file: axiosInterceptor.ts:31 ~ resInterceptorFn ~ headers.staffname:', headers.staffname);
        // if (headers.staffname) {
        //   // 写入全局状态
        //   setCurrentStaffName(headers.staffname);
        // }

        // if (headers['content-type'] === '"application/octet-stream"') //这个也可以的
        if (res.config.responseType === 'arraybuffer') {
          return data;
        }

        if (data.code === 0) return data;
      }

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        code: parseInt(data?.code, 10),
        message: data?.errorMessage || 'fail',
        rawResponse: res,
        rawError: null,
      } as unknown as CommonError);
    };

    // 响应拦截器：异常
    const resErrInterceptorFn = (err: AxiosError) => {
      const { response } = err;
      // token过期，智能网关会返回401，前端只需要刷新页面就好
      if (response?.status === 401) {
        window.location.reload();
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        code: err?.response?.status,
        message: err?.response?.statusText,
        rawResponse: null,
        rawError: err,
      } as unknown as CommonError);
    };
    // 注册拦截器
    axiosInstance.interceptors.request.use(reqInterceptorFn, reqErrInterceptorFn);
    // 销毁拦截器
    axiosInstance.interceptors.response.use(resInterceptorFn, resErrInterceptorFn);
  }

  return <></>;
};

export default AxiosInterceptor;
