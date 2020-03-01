import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { setSessionThunk } from '../../modules/sessionAuth';

import MainLayout from '../../components/main/MainLayout';
import {
    connectWebsocket as connectRankingWebsocket,
    disconnectWebsocket as disconnectRankingWebsocket,
    clearValue as clearRankingValue
} from '../../modules/ranking';
import {
    connectWebsocket as connectBillBoardWebsocket,
    disconnectWebsocket as disconnectBillBoardWebsocket,
    clearValue as clearBillBoardValue
} from '../../modules/billBoard'; 

const MainLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        
        dispatch(disconnectRankingWebsocket());
        dispatch(disconnectBillBoardWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectRankingWebsocket());
            dispatch(connectBillBoardWebsocket());
        })
        
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectRankingWebsocket());
            dispatch(disconnectBillBoardWebsocket());
            dispatch(clearRankingValue());
            dispatch(clearBillBoardValue());
        };
    }, [dispatch]);

    // useEffect(() => {
    //     dispatch(clearValue());
    // }, [dispatch])

    const [state] = useAsync(connection, [ dispatch ]);

    const { loading, data, error } = state;

    // if(loading) return null;
    // if(error) return null;
    // if(data) {
    //     return (
    //         <MainLayout />
    //     )
    // }
    // return null;

    return (
        <MainLayout />
    )
};

export default MainLayoutContainer;