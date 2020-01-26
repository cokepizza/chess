import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';

const CONNECT_WEBSOCKET = 'ranking/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'ranking/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'ranking/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'ranking/INITIALIZE_SOCKET';
const CLEAR_VALUE = 'ranking/CLEAR_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET);
export const initializeValue = createAction(INITIALIZE_VALUE);
export const clearValue = createAction(CLEAR_VALUE);

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, { 
        url: '/ranking',
        initializeSocket,
        initializeValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* rankingSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    ranking: null,
    error: null,
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        ...rest,
    }),
    [CLEAR_VALUE]: state => initialState,
}, initialState);