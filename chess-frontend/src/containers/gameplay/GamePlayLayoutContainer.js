import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'uuid/v1';

import useAsync from '../../lib/hook/useAsync';
import GamePlayLayout from '../../components/gameplay/GamePlayLayout';
import { setSessionThunk } from '../../modules/sessionAuth';

import { clearValue as clearAuthValue } from '../../modules/socketAuth';
import { clearValue as clearGameValue } from '../../modules/game';

import { connectWebsocket as connectAuthWebsocket } from '../../modules/socketAuth';
import { connectWebsocket as connectGameWebsocket } from '../../modules/game';
import { connectWebsocket as connectChatWebsocket } from '../../modules/chat';
import { connectWebsocket as connectCanvasWebsocket} from '../../modules/canvas';
import { connectWebsocket as connectRecordWebsocket } from '../../modules/record';

import { disconnectWebsocket as disconnectAuthWebsocket } from '../../modules/socketAuth';
import { disconnectWebsocket as disconnectGameWebsocket } from '../../modules/game';
import { disconnectWebsocket as disconnectChatWebsocket } from '../../modules/chat';
import { disconnectWebsocket as disconnectCanvasWebsocket } from '../../modules/canvas';
import { disconnectWebsocket as disconnectRecordWebsocket } from '../../modules/record';

const GamePlayLayoutContainer = ({ gameKey }) => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        dispatch(disconnectGameWebsocket());
        dispatch(disconnectAuthWebsocket());
        dispatch(disconnectChatWebsocket());
        dispatch(disconnectCanvasWebsocket());
        dispatch(disconnectRecordWebsocket());
        await Promise.resolve().then(() => {
            const tabKey = uuid();
            const param = {
                gameKey,
                tabKey,
            }
            dispatch(connectGameWebsocket(param));
            dispatch(connectAuthWebsocket(param));
            dispatch(connectChatWebsocket(param));
            dispatch(connectCanvasWebsocket(param));
            dispatch(connectRecordWebsocket(param));
        })
        return true;
    };

    useEffect(() => {
        return () => {
            dispatch(disconnectGameWebsocket());
            dispatch(disconnectAuthWebsocket());
            dispatch(disconnectChatWebsocket());
            dispatch(disconnectCanvasWebsocket());
            dispatch(disconnectRecordWebsocket());
        }
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearAuthValue());
            dispatch(clearGameValue());
        }
    }, [dispatch]);

    const [state] = useAsync(connection, [ dispatch, gameKey ]);

    const { loading, data, error } = state;

    // if(loading) return null;
    // if(error) return null;
    // if(data) {
    //     return (
    //         <GamePlayLayout />
    //     )
    // }
    // return null;

    return (
        <GamePlayLayout />
    )
};

export default GamePlayLayoutContainer;