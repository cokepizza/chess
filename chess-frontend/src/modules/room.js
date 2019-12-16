import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as roomCtrl from '../lib/api/room';


const INITIALIZE_VALUE = 'room/INITIALIZE_VALUE';
const CONNECT_WEBSOCKET = 'room/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'room/DISCONNECT_WEBSOCKET';
const [ CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE ] = createRequestActionTypes('/room/CREATE_ROOM');

export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const createRoomThunk = createRequestThunk(CREATE_ROOM, roomCtrl.createRoom);

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, { 
        url: '/room',
        initializeValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* roomSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    room: null,
    error: null,
}

export default handleActions({
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