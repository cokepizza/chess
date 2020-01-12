import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { connectWebsocket, disconnectWebsocket } from '../../modules/canvas';
import CanvasWrapper from '../../components/game/CanvasWrapper';

const CanvasWrapperContainer = ({ gameId, cellSize }) => {
    const dispatch = useDispatch();

    const connection = async () => {
        dispatch(disconnectWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectWebsocket(gameId));
        });
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectWebsocket());
        }
    }, [dispatch]);

    const [state] = useAsync(connection, [dispatch]);

    const { loading, data, error } = state;

    if(loading) return null;
    if(error) return null;
    if(data) {
        return (
            <CanvasWrapper cellSize={cellSize} />
        )
    }
    return null;
};

export default CanvasWrapperContainer;