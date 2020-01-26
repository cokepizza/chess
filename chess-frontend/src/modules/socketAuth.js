import { createAction, handleActions } from 'redux-actions';
import { connectNamespace } from '../lib/websocket/websocket';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

const CONNECT_WEBSOCKET = 'socketAuth/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'socketAuth/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_SOCKET = 'socketAuth/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'socketAuth/INITIALIZE_VALUE';
const CLEAR_VALUE = 'socketAuth/CLEAR_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

function* connectWebsocketSaga (action) {
    const query = action.payload;
    
    const socketTask = yield fork(connectNamespace, {
        url: '/socketAuth',
        initializeSocket,
        initializeValue,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* socketAuthSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    nickname: null,
    role: null,
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