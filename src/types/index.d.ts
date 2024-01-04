export interface CommonError extends Error {
  msg: string;
  // 错误码
  code?: number;

  // 错误信息
  message: string;

  // HTTP 状态码
  status?: number;

  // 原始响应
  rawResponse?: AxiosResponse;

  // 原始 axios 错误对象
  rawError?: AxiosError;
}
