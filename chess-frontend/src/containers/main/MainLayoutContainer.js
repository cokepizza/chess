import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { setSessionThunk } from '../../modules/sessionAuth';

import MainLayout from '../../components/main/MainLayout';
import { connectWebsocket, disconnectWebsocket, clearValue } from '../../modules/ranking';

const MainLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        
        dispatch(disconnectWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectWebsocket());
        })
        
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectWebsocket());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearValue());
    }, [dispatch])

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