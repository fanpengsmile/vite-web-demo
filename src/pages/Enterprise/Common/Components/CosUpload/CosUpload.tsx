/**
 * 类似于对接了OCS的上传组件。后端会给前端一个临时签名，前端拿到签名之后配置cos对象，然后在上传
 * 临时签名是一次性的，每次都要重新new COS对象
 * 详情请参考文档： https://cloud.tencent.com/document/product/436/11459
 * @author peytonfan
 */
import React, { useEffect, useState } from 'react';
import { Upload, Image, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import isFunction from 'lodash/isFunction';
// import Style from './CosUpload.css'
import { cosGetObjectUrl, cosPutObject } from './util'; // 需要删除可导出：cosDeleteObjectUrl

const { Dragger } = Upload;

export const fileDirectory = 'online'; // 不同环境有不同目录，桶内定的

const getFileKey = (file: any) => `${fileDirectory}/${file?.uid}/${file?.name}`;

// export async function batchSignFiles(fileList) {
//   const signedList = []
//   for (const file of fileList) {
//     if (!file?.name) break // 兼容cem老数据的文件
//     // eslint-disable-next-line no-await-in-loop
//     const [res] = await cosGetObjectUrl(getFileKey(file))
//     signedList.push({
//       ...file,
//       url: res,
//     })
//   }
//   return signedList
// }

const CosUpload = (props: any) => {
  const {
    size,
    children,
    isView,
    value = [],
    accept,
    supportedFileType = '',
    onChange: onChangeFile,
    env,
    maxCount,
    setCosBucket,
    ...draggerProps
  } = props;
  const [fileList, setFileList] = useState([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // const signDefaultFileList = async (fileList: any) => {
  //   updateFileList(await batchSignFiles(fileList)); // 设置每次初始化的默认附件列表
  // };

  // 监听文件列表的变化，以便通知到调用方
  useEffect(() => {
    if (fileList.length > 0 && isFunction(onChangeFile)) {
      const list = fileList.map((i: any) => ({
        uid: i.uid,
        name: i.name,
        status: i.status ?? '',
      }));
      onChangeFile(list);
    }
  }, [fileList]);

  // 监听value的变化，以便设置当前文件列表（为什么要监听，因为初始值的获取可能是异步，不能设置一次就不管，因为第一次可能为空）
  useEffect(() => {
    // 仅仅当当前文件列表为空时执行
    (async () => {
      if (value?.length && value.length > 0 && fileList.length === 0) {
        const arr = [];
        const promise = value.map((i: number) => cosGetObjectUrl(getFileKey(i)));
        const resArr = await Promise.allSettled(promise);
        for (let index = 0; index < resArr.length; index++) {
          const res = resArr[index];
          // console.log('🚀 ~ file: CosUpload.tsx:81 ~ aaaaa:', aaaaa);
          // const { status, value } = resArr[index];
          if (res.status === 'fulfilled') {
            const [url] = res.value;
            arr.push({ ...value[index], url, status: 'done' });
          }
        }

        setFileList(arr as any);
      }
    })();
  }, [value]);

  const prop = {
    ...draggerProps,
    listType: 'picture',
    accept,
    fileList,
  };

  /**
   *
   * @param info 上传文件改变时的回调
   */
  const onChange = (info: any) => {
    const { file, fileList } = info;
    const { status } = file; // error | success | done | uploading | removed
    if (status === 'uploading') {
      // to do something
    } else if (status === 'done') {
      const location = file?.response?.Location || '';
      const locationList = location.split('/');
      locationList.shift();
      setCosBucket(locationList.join('/'));
      message.success(`文件${file.name}上传成功.`);
    } else if (status === 'error') {
      message.error(`文件${file.name}上传失败`);
    } else if (status === 'removed') {
      // 如果需要删除cos的资源，可以使用这段代码，我已调通，但本次功能暂时不需要，所以注释掉了。
      // try {
      //   await cosDeleteObjectUrl(getFileKey(file as RcFile));
      // } catch (err) {
      //   message.error(`文件${file.name}删除失败. ${err}`);
      //   return;
      // }
      // message.success(`文件${file.name}删除成功.`);
    }

    setFileList(
      fileList.map((i: any) => {
        return { ...i, url: 'url' }; // 如果有url参数，文件列表的文件名就按a链接来显示
      }),
    );
  };
  /**
   * 上传文件之前的钩子
   * @param file
   * @returns
   */
  const onBeforeUpload = (file: any) => {
    if (file.size > size * 1024 * 1024) {
      message.error(`当前文件过大,请保证文件大小不超过${size}MB！`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  /**
   * 通过覆盖默认的上传行为，可以自定义自己的上传实现
   * @param options
   */
  const onCustomRequest = async (options: any) => {
    const { file, onProgress, onError, onSuccess } = options;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [data, err] = await cosPutObject(file, (percent: any) => onProgress({ percent }), getFileKey(file), env);
    if (err) {
      onError(err);
    } else {
      onSuccess(data);
    }
  };
  /**
   * 点击文件列表item的事件
   * @param file
   */
  const onPreview = async (file: any) => {
    const isImg = file.type?.includes('image');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [url, err] = await cosGetObjectUrl(getFileKey(file)); // 这里的key要和cosPutObject时的key匹配

    if (err) {
      message.error(`${isImg ? '预览' : '下载'}失败: ${err.message}`);
    } else if (isImg) {
      setPreviewUrl(url);
      setVisiblePreview(true);
    } else {
      window.open(url, '_blank');
    }
  };
  const renderChildren = () => {
    if (!children) {
      return (
        <>
          <div>
            <CloudUploadOutlined size={30} color='#2971ef' />
          </div>
          <div>点击此处或者拖拽文件到该区域进行上传</div>
          <div>
            文件大小不能超过{size}MB;文件格式仅支持{supportedFileType}
          </div>
        </>
      );
    }
    return children;
  };
  // console.log('prop---', prop);

  return (
    <div style={{ width: '100%' }}>
      <Dragger
        // className={`${isView ? 'cosUploadOnlyFileList' : ''}`}
        {...prop}
        onChange={onChange}
        beforeUpload={onBeforeUpload}
        customRequest={onCustomRequest}
        onPreview={onPreview}
        maxCount={maxCount}
      >
        {renderChildren()}
      </Dragger>
      <Image
        width={0}
        style={{ display: 'none' }}
        src=''
        preview={{
          visible: visiblePreview,
          src: previewUrl,
          onVisibleChange: (value) => {
            setVisiblePreview(value);
          },
        }}
      />
    </div>
  );
};
export default CosUpload;
