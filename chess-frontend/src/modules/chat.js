import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import SocketIo from 'socket.io-client';
import { takeEvery, fork, put, call, take, cancel, cancelled } from 'redux-saga/effects';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as chatAPI from '../lib/api/chat';

const INITIALIZE_VALUE = 'chat/INITIALIZE_VALUE';
const CONNECT_WEBSOCKET = 'chat/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'chat/DISCONNECT_WEBSOCKET';
const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';

const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';
const INITIALIZE_TEXTFIELD = 'chat/INITIALIZE_TEXTFIELD';

export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const websocketOnmessage = createAction(WEBSOCKET_ONMESSAGE, payload => payload);

const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');
export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, chatAPI.sendMessage);

export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
export const initializeTextfield = createAction(INITIALIZE_TEXTFIELD);

function* createEventChannel(io) {
    return eventChannel(emit => {
        io.on('message', message => {
            emit(message)
        });
        return () => {
            io.close();
        }
    })
}

function* connectNamespace() {
    let channel;

    try {
        const io = SocketIo('/chat');
        channel = yield call(createEventChannel, io);
    
        while(true) {
            const message = yield take(channel);
            yield put(websocketOnmessage(message));
        }
    } catch(e) {
        console.dir(e);
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace);
    
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
    [WEBSOCKET_ONMESSAGE]: (state, { payload: message }) => ({
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