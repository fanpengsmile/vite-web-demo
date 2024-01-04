/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CommonError } from '../types';

interface RequestInterceptors {
  // 请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (err: any) => any;
  // 响应拦截
  responseInterceptors?: <T = AxiosResponse>(config: T) => T;
  responseInterceptorsCatch?: (err: any) => any;
}
// 自定义传入的参数
interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors;
}

interface IResponseData<T = any> {
  code: number;
  msg: string;
  result: T;
}
const baseConfig: RequestConfig = {
  baseURL: '/api',
  timeout: 30000, // 超时给到30秒
  headers: { 'X-Requested-With': 'XMLHttpRequest' }, // 统一登录 https://iwiki.woa.com/pages/viewpage.action?pageId=944573834
  withCredentials: true, // 统一登录 https://iwiki.woa.com/pages/viewpage.action?pageId=944573834
};
const axiosInstance: AxiosInstance = axios.create(Object.assign(baseConfig));

async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> {
  try {
    const res = await promise;
    return [res, null];
  } catch (e) {
    // 这里捕获到的错误是Promise.reject()抛出的，因此类型应该是AxiosError
    return [null, e as E];
  }
}

/**
 * 这里的泛型T就是真实接口返回数据result里面内容的类型，可以在调用requestApi的时候传递进来
 * requestApi函数的返回类型是Promise<[null, CommonError] | [T, null]>
 */
async function request<T = any>(config: RequestConfig): Promise<[null, CommonError] | [T, null]> {
  return tryCatch<T, CommonError>(
    axiosInstance.request<any, IResponseData<T> | T>(config).then((res) => {
      if (config.responseType === 'arraybuffer') {
        return res as T;
      }
      return (res as IResponseData<T>).result;
    }),
  );
}

async function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<[null, CommonError] | [T, null]> {
  return tryCatch<T, CommonError>(
    axiosInstance.post<any, IResponseData<T>>(url, data, config).then((res) => {
      return res.result;
    }),
  );
}

export default request;
export { post, axiosInstance };
export type ServiceType<F, T> = (filter: F) => Promise<[null, CommonError] | [T, null]>;
