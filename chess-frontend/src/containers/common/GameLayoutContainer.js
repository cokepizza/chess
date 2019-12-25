import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import GameLayout from '../../components/common/GameLayout';
import { setSessionThunk } from '../../modules/auth';
import { connectWebsocket as connectAuthWebsocket } from '../../modules/auth';
import { connectWebsocket as connectGameWebsocket } from '../../modules/game';
import { connectWebsocket as connectChatWebsocket } from '../../modules/chat';
import { connectWebsocket as connectCanvasWebsocket} from '../../modules/canvas';
import { connectWebsocket as connectRecordWebsocket } from '../../modules/record';

import { disconnectWebsocket as disconnectAuthWebsocket } from '../../modules/auth';
import { disconnectWebsocket as disconnectGameWebsocket } from '../../modules/game';
import { disconnectWebsocket as disconnectChatWebsocket } from '../../modules/chat';
import { disconnectWebsocket as disconnectCanvasWebsocket } from '../../modules/canvas';
import { disconnectWebsocket as disconnectRecordWebsocket } from '../../modules/record';

import useAsync from '../../lib/hook/useAsync';

const GameLayoutContainer = ({ gameId }) => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
      
        dispatch(disconnectAuthWebsocket());
        dispatch(disconnectGameWebsocket());
        dispatch(disconnectChatWebsocket());
        dispatch(disconnectCanvasWebsocket());
        dispatch(disconnectRecordWebsocket());
        setTimeout(() => {
            dispatch(connectAuthWebsocket(gameId));
            dispatch(connectGameWebsocket(gameId));
            dispatch(connectChatWebsocket(gameId));
            dispatch(connectCanvasWebsocket(gameId));
            dispatch(connectRecordWebsocket(gameId));
        }, 0);
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectAuthWebsocket());
            dispatch(disconnectGameWebsocket());
            dispatch(disconnectChatWebsocket());
            dispatch(disconnectCanvasWebsocket());
            dispatch(disconnectRecordWebsocket());
        }
    }, [dispatch]);

    const [state] = useAsync(connection, [ dispatch, gameId ]);

    const { loading, data, error } = state;

    if(loading) return null;
    if(error) return null;
    if(data) {
        return (
            <GameLayout />
        )
    }
    return null;
};

export default GameLayoutContainer;