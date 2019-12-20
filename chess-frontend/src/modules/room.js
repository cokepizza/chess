import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as roomCtrl from '../lib/api/room';


const CONNECT_WEBSOCKET = 'room/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'room/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'room/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'room/INITIALIZE_SOCKET';
export const initializeSocket = createAction(INITIALIZE_SOCKET);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);

const [ CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE ] = createRequestActionTypes('room/CREATE_ROOM');
export const createRoomThunk = createRequestThunk(CREATE_ROOM, roomCtrl.createRoom);

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, { 
        url: '/room',
        initializeSocket,
        initializeValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* roomSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    room: null,
    error: null,
}

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { room }}) => ({
        ...state,
        room,
    }),
    [CREATE_ROOM_SUCCESS]: state => state,
    [CREATE_ROOM_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
}, initialState);