import React, { useEffect }  from 'react';
import { useDispatch } from 'react-redux';
import ContentLayout from '../../components/common/ContentLayout';
import { connectWebsocket, setSessionThunk } from '../../modules/auth';
import useAsync from '../../lib/hook/useAsync';

const ContentLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        dispatch(connectWebsocket());
        return true;
    };

    const [state, refetch] = useAsync(connection, [ dispatch ]);

    const { loading, data, error } = state;
    
    if(loading) return null;
    if(error) return null;
    if(data) {
        console.dir('dataaa');
        return (
            <ContentLayout />
        )
    }
    return null;
};

export default ContentLayoutContainer;