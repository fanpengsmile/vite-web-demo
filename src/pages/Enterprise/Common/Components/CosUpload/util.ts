import COS from 'cos-js-sdk-v5';
import { isEmpty, isFunction } from 'lodash';
import { getCosTempToken } from 'services/enterprise';
import { message } from 'antd';

export const CosConfig = {
  Bucket: 'dcem-1258344699' /* 必须 */,
  Region: 'ap-guangzhou' /* 存储桶所在地域，必须字段 */,
  StorageClass: 'STANDARD',
  bucketName: 'dcem',
};

const { Bucket, Region, StorageClass, ...otherParams } = CosConfig;

const cos = new COS({
  // getAuthorization 必选参数
  getAuthorization: async (options, callback) => {
    const [res, err] = await getCosTempToken();
    if (err) {
      message.error(err.message);
      return;
    }
    if (isEmpty(res?.Credentials)) {
      message.error(`获取临时签名失败`);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    callback({
      TmpSecretId: res?.Credentials.TmpSecretId,
      TmpSecretKey: res?.Credentials.TmpSecretKey,
      XCosSecurityToken: res?.Credentials?.Token,
      ExpiredTime: res?.ExpiredTime,
    });
  },
  // 可选参数
  FileParallelLimit: 3, // 控制文件上传并发数
  ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
  ProgressInterval: 1000, // 控制上传的 onProgress 回调的间隔
});

export const cosGetObjectUrl = (key: any, sign = true) => {
  return new Promise((resolve) => {
    cos.getObjectUrl(
      {
        Bucket,
        Region,
        Key: key,
        Sign: sign,
        Method: 'GET',
      },
      (err, data) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          resolve([null, err]);
        } else {
          resolve([data?.Url, null]);
        }
      },
    );
  });
};

export function randomString(length: number, options: any) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (options.number) {
    letters.push(...'1234567890'.split(''));
  }

  if (options.symbol) {
    letters.push(...options.symbolList);
  }

  return Array.from({ length })
    .fill('-')
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');
}

export const cosPutObject = (file: any, progressCB: any, key: any, env: string) => {
  return new Promise((resolve) => {
    const currentEnv = env === 'Local' || env === 'development' ? 'dev' : 'online'; // 不同环境有不同目录，桶内定的
    const Key = key || `${currentEnv}/${randomString(18, { number: false, symbol: false })}-${file?.name}`;
    const newFile = new File([file], Key);
    cos.putObject(
      {
        Bucket /* 必须 */,
        Region /* 存储桶所在地域，必须字段 */,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        StorageClass,
        ...otherParams,
        Key /* 必须 */,
        Body: newFile, // 上传文件对象
        onProgress(progressData) {
          if (isFunction(progressCB)) progressCB(progressData.percent * 100); // progressData.percent * 100 注意这里返回的data的进度是0到1，而antd的是0-100
        },
      },
      (err, data) => {
        // console.log('🚀 ~ file: cosUtils.ts:89 ~ returnnewPromise ~ err:', err);
        // console.log('🚀 ~ file: cosUtils.ts:89 ~ returnnewPromise ~ data:', data);
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          resolve([null, err]);
        } else {
          resolve([data, null]);
        }
      },
    );
  });
};
