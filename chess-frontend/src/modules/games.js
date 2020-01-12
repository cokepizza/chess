import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as gamesCtrl from '../lib/api/games';

const CONNECT_WEBSOCKET = 'games/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'games/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'games/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'games/INITIALIZE_SOCKET';
const CLEAR_VALUE = 'games/CLEAR_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

const [ CREATE_GAME, CREATE_GAME_SUCCESS, CREATE_GAME_FAILURE ] = createRequestActionTypes('games/CREATE_GAME');
export const createGameThunk = createRequestThunk(CREATE_GAME, gamesCtrl.createGame);

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, { 
        url: '/games',
        initializeSocket,
        initializeValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* gamesSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    games: null,
    error: null,
}

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { games }}) => ({
        ...state,
        games,
    }),
    [CLEAR_VALUE]: state => initialState,
    [CREATE_GAME_SUCCESS]: state => state,
    [CREATE_GAME_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
}, initialState);