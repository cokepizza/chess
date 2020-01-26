import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as chatAPI from '../lib/api/chat';

const CONNECT_WEBSOCKET = 'chat/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'chat/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET, payload => payload);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_SOCKET = 'chat/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'chat/INITIALIZE_VALUE';
const CHANGE_VALUE = 'chat/CHANGE_VALUE';
const CLEAR_VALUE = 'chat/CLEAR_VALUE'
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';
const INITIALIZE_TEXTFIELD = 'chat/INITIALIZE_TEXTFIELD';
export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
export const initializeTextfield = createAction(INITIALIZE_TEXTFIELD);

const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');
export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, chatAPI.sendMessage);

function* connectWebsocketSaga (action) {
    const query = action.payload;
    
    const socketTask = yield fork(connectNamespace, {
        url: '/chat',
        initializeSocket,
        initializeValue,
        changeValue,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* chatSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    messages: [],
    text: '',
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { nickname, color, message }}) => ({
        ...state,
        messages: [{ nickname, color, message }],
    }),
    [CHANGE_VALUE]: (state, { payload: { nickname, color, message} }) => ({
        ...state,
        messages: [ ...state.messages, { nickname, color, message} ],
    }),
    [SEND_MESSAGE_SUCCESS]: state => state,
    [SEND_MESSAGE_FAILURE]: state => state,
    [INITIALIZE_TEXTFIELD]: state => ({
        ...state,
        text: '',
    }),
    [CHANGE_TEXTFIELD]: (state, { payload: text}) => ({
        ...state,
        text,
    }),
    [CLEAR_VALUE]: state => initialState,
}, initialState);