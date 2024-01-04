/**
 * 前端性能监控
 * 文档： https://cloud.tencent.com/document/product/1464
 * 总览： https://console.cloud.tencent.com/rum/web
 */
import Aegis from 'aegis-web-sdk';
import { get, isString } from 'lodash';

let aegisInstance: any; // 单例模式

export function initEnterpriseRUM() {
    if (aegisInstance) return; // 如果已有aegisInstance实例，则不再新建
    const isDev = (import.meta.env.MODE) !== 'Production' ? true : false
    aegisInstance = new Aegis({
        id: 'O5P13TQ6gWbxD5OVKg', // 上报 id
        reportApiSpeed: true, // 接口测速
        reportAssetSpeed: true, // 静态资源测速
        spa: true, // spa 应用页面跳转的时候开启 pv 计算
        env: isDev
            ? Aegis.environment.development
            : Aegis.environment.production,
        /**
         * beforeRequest钩子函数：https://cloud.tencent.com/document/product/1464/58557
         */
        beforeRequest(data: any) {
            // 入参data的数据结构：{logs: {…}, logType: "log"}
            // 当 logType 为 'log' 时，logs 数据类型为 {msg: "日志详情", level: '4', ext1: '', ext2: '', ext3: '', trace: ''}。
            if (data?.logType === 'log') {
                // 'ResizeObserver loop'为antd的bug, 忽略该类型日志
                if (data?.logs?.msg.includes?.('ResizeObserver loop')) {
                    return false;
                }
                // 没有权限的问题不上报
                if (
                    data?.logs?.code === '-10000024'
                ) {
                    return false
                }
            }
            // 本地环境禁止上报
            if (import.meta.env.MODE === 'Local') {
                return false
            }
            return data;
        },
        api: {
            apiDetail: true, // Aegis SDK 在错误发生的时候，不会主动收集接口请求参数和返回信息，如果需要对进口信息进行上报，可以使用 API 参数里面的 apiDetail 进行开启。
            /**
             * retCodeHandler参考文档：https://cloud.tencent.com/document/product/1464/58560#exp1
             */
            retCodeHandler(originData: string | object) {
                let data;
                try {
                    data = isString(originData) ? JSON.parse(originData) : originData;
                    const returnCode = get(data, 'code');

                    // code 不为0，此次请求就是错误的。则上报一条 retcode 异常的日志
                    return {
                        isErr: returnCode !== 0,
                        code: returnCode,
                        data: JSON.stringify(data),
                    };
                } catch (e) {
                    console.error('retCodeHandler解析data出错', e, { data: originData });
                    return {
                        isErr: false,
                        code: 'returnCodeParseFailed',
                        data: JSON.stringify(data),
                    };
                }
            },
        },
    });
    console.info('[Enterprise Aegis] initiated');
}

export const rumConfigAegis = (staffname: string) => {
    aegisInstance.setConfig({ uin: staffname });
};

export const RumCaptureException = (error: Error) => {
    console.info('[Enterprise Aegis] exception captured.');
    aegisInstance.error({
        ...error,
        msg: error.message,
        trace: error.stack,
    });
};
