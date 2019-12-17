import React from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { setSessionThunk } from '../../modules/auth';
import MainLayout from '../../components/main/MainLayout';
import { connectWebsocket } from '../../modules/auth';

const MainLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        dispatch(connectWebsocket());
        return true;
    };

    const [state] = useAsync(connection, [ dispatch ]);

    const { loading, data, error } = state;

    if(loading) return null;
    if(error) return null;
    if(data) {
        return (
            <MainLayout />
        )
    }
    return null;
};

export default MainLayoutContainer;