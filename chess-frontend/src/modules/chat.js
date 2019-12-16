import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as chatAPI from '../lib/api/chat';

const CONNECT_WEBSOCKET = 'chat/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'chat/DISCONNECT_WEBSOCKET';
const INITIALIZE_VALUE = 'chat/INITIALIZE_VALUE';
const CHANGE_VALUE = 'chat/CHANGE_VALUE';

const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';
const INITIALIZE_TEXTFIELD = 'chat/INITIALIZE_TEXTFIELD';

export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);

const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');
export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, chatAPI.sendMessage);

export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
export const initializeTextfield = createAction(INITIALIZE_TEXTFIELD);

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, {
        url: '/chat',
        initializeValue,
        changeValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* chatSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    messages: [],
    text: '',
};

export default handleActions({
    [INITIALIZE_VALUE]: (state, { payload: messages }) => ({
        ...state,
        messages,
    }),
    [CHANGE_VALUE]: (state, { payload: message }) => ({
        ...state,
        messages: [ ...state.messages, message ],
    }),
    [SEND_MESSAGE_SUCCESS]: (state, { payload: data }) => ({
        ...state,
    }),
    [SEND_MESSAGE_FAILURE]: (state, { payload: error }) => ({
        ...state,
    }),
    [INITIALIZE_TEXTFIELD]: state => ({
        ...state,
        text: '',
    }),
    [CHANGE_TEXTFIELD]: (state, { payload: text}) => ({
        ...state,
        text,
    }),
}
, initialState);