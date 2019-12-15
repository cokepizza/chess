import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, put, call, take, cancel, cancelled } from 'redux-saga/effects';

import 
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as roomCtrl from '../lib/api/room';

const INITIALIZE_ROOM = 'room/SET_ROOM';
const INITIALIZE_WEBSOCKET = 'room/INITIALIZE_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'room/DISCONNECT_WEBSOCKET';
const [ CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE ] = createRequestActionTypes('/room/CREATE_ROOM');

export const initializeRoom = createAction(INITIALIZE_ROOM, payload => payload);
export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const createRoomThunk = createRequestThunk(CREATE_ROOM, roomCtrl.createRoom);

function* initializeWebsocketSaga () {
    const socketTask = yield fork(initializeNamespace);
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* roomSaga () {
    yield takeEvery(INITIALIZE_WEBSOCKET, initializeWebsocketSaga);
}

const initialState = {
    room: null,
    error: null,
}

export default handleActions({
    [CREATE_ROOM_SUCCESS]: state => state,
    [CREATE_ROOM_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
    [INITIALIZE_ROOM]: (state, { payload: { type, room } }) => ({
        ...state,
        room,
    }),
}, initialState);