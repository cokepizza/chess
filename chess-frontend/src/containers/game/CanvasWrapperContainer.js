import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { connectWebsocket, disconnectWebsocket } from '../../modules/canvas';
import CanvasWrapper from '../../components/game/CanvasWrapper';

const CanvasWrapperContainer = ({ gameKey, cellSize }) => {
    const dispatch = useDispatch();

    const connection = async () => {
        dispatch(disconnectWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectWebsocket({
                gameKey,
            }));
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

    // if(loading) return null;
    // if(error) return null;
    // if(data) {
    //     return (
    //         <CanvasWrapper cellSize={cellSize} />
    //     )
    // }
    // return null;

    //  glanceAt라는 flag를 통해 role이 없이도 canvas를 조회할 수 있음
    return (
        <CanvasWrapper
            cellSize={cellSize}
            glanceAt={true}
        />
    )
    
};

export default CanvasWrapperContainer;