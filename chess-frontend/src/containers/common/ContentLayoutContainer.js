import React from 'react';
import { useDispatch } from 'react-redux';
import ContentLayout from '../../components/common/ContentLayout';
import { connectWebsocket as connectAuthWebsocket, setSessionThunk } from '../../modules/auth';
import { connectWebsocket as connectCanvasWebsocket} from '../../modules/canvas';
import useAsync from '../../lib/hook/useAsync';

const ContentLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        console.dir('connection~');
        dispatch(connectAuthWebsocket());
        dispatch(connectCanvasWebsocket());
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