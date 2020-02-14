import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWebsocket , disconnectWebsocket } from '../../modules/billBoard';
import Canvas from '../../components/gameplay/Canvas';
import useAsync from '../../lib/hook/useAsync';

const BillBoardCanvasWrapperContainer = ({ roomKey, cellSize }) => {
    const { boards } = useSelector(({ billBoard }) => ({
        boards: billBoard.boards,
    }));

    const dispatch = useDispatch();

    // useEffect(() => {
    //     return () => {
    //         dispatch(clearValue());
    //     }
    // }, [dispatch])

    const connection = async () => {
        dispatch(disconnectWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectWebsocket({
                roomKey,
            }));
        });
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectWebsocket());
        }
    }, [dispatch]);

    const onContextMenu = useCallback(e => {
        e.preventDefault();
    }, []);

    const [state] = useAsync(connection, [dispatch]);

    const { loading, data, error } = state;

    if(loading) return null;
    if(error) return null;
    if(data) {
        if(!boards || !boards[roomKey]) {
            //  activity indicator
            return null;
        }
        return (
            <Canvas
                board={boards[roomKey]}
                blocked={true}
                onContextMenu={onContextMenu}
                cellSize={cellSize}
            />
        )
    }
    return null;
};

export default BillBoardCanvasWrapperContainer;