import React from 'react';
import { useDispatch } from 'react-redux';
import GameLayout from '../../components/common/GameLayout';
import { setSessionThunk } from '../../modules/auth';
import { connectWebsocket as connectChatWebsocket } from '../../modules/chat';
import { connectWebsocket as connectCanvasWebsocket} from '../../modules/canvas';
import useAsync from '../../lib/hook/useAsync';

const GameLayoutContainer = ({ gameKey }) => {
    const dispatch = useDispatch();

    const connection = async () => {
        await dispatch(setSessionThunk());
        dispatch(connectChatWebsocket(gameKey));
        dispatch(connectCanvasWebsocket(gameKey));
        return true;
    };

    const [state, refetch] = useAsync(connection, [ dispatch ]);

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