import { useStore } from 'store';
import React, { useEffect } from 'react';
import { message } from 'antd';
import { getInitialState } from 'services/enterprise';

export function initEnterPrise() {
    const setEnterPrisePanshiAuth = useStore((state: any) => state.setEnterPrisePanshiAuth);
    const fetchInit = async () => {
        const [res, err] = await getInitialState();
        if (err) {
            message.error(err);
            return
        }
        setEnterPrisePanshiAuth(res);
    };
    useEffect(() => {
        fetchInit();
    }, []);
}
