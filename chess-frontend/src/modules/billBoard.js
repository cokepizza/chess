import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';

const CONNECT_WEBSOCKET = 'billBoard/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'billBoard/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'billBoard/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'billBoard/INITIALIZE_SOCKET';
const CLEAR_VALUE = 'billBoard/CLEAR_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

function* connectWebsocketSaga (action) {
    const query = action.payload;

    const socketTask = yield fork(connectNamespace, { 
        url: '/billBoard',
        initializeSocket,
        initializeValue,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* billBoardSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    board: null,
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest }}) => ({
        ...state,
        ...rest,
    }),
    [CLEAR_VALUE]: state => initialState,
}, initialState);