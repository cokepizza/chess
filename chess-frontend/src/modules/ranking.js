import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';

const CONNECT_WEBSOCKET = 'ranking/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'ranking/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'ranking/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'ranking/INITIALIZE_SOCKET';
export const initializeSocket = createAction(INITIALIZE_SOCKET);
export const initializeValue = createAction(INITIALIZE_VALUE);

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
    
};

export default handleActions({
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        ...rest,
    }),
}, initialState);