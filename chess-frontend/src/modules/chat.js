import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, take } from 'redux-saga/effects';
import SocketIo from 'socket.io-client';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as chatAPI from '../lib/api/chat';
import { setTemporaryAuth } from '../modules/auth';

const INITIALIZE_WEBSOCKET = 'chat/INITIALIZE_WEBSOCKET';
const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';

const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';
const INITIALIZE_TEXTFIELD = 'chat/INITIALIZE_TEXTFIELD';
const SET_RECEIVED_MESSAGE = 'chat/SET_RECEIVED_MESSAGE';

export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);
export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
export const initializeTextfield = createAction(INITIALIZE_TEXTFIELD);
const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');
export const setReceivedMessage = createAction(SET_RECEIVED_MESSAGE, payload => payload);

export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, chatAPI.sendMessage);

function* createEventChannel(io) {
    return eventChannel(emit => {
        // socket.onmessage = message => emit(message.data);
        // io.emit('message', 'message sent');

        io.on('connect', () => {
            console.dir('connect~~');
            
        })
        io.on('message', message => {
            emit(message)
        });

        return () => {
            io.close();
        }
    })
}

function* initializeWebsocketSaga () {
    // const io = SocketIo('ws://localhost:4000');
    // const io = SocketIo('ws://192.168.13.101:5000');
    const io = SocketIo('ws://localhost:5000');
    const channel = yield call(createEventChannel, io);

    while(true) {
        const message = yield take(channel);
        if (message.type === 'auth') {
            yield put(setTemporaryAuth(message));
        } else if (message.type === 'chat') {
            yield put(setReceivedMessage(message));
        }
    }
}

export function* chatSaga () {
    yield takeEvery(INITIALIZE_WEBSOCKET, initializeWebsocketSaga);
}

const initialState = {
    messages: [],
    text: '',
};

export default handleActions({
    [WEBSOCKET_ONMESSAGE]: (state, { payload: message }) => ({
        ...state,
        messages: [ ...state.messages, message ],
    }),
    [CHANGE_TEXTFIELD]: (state, { payload: text}) => ({
        ...state,
        text,
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
    [SET_RECEIVED_MESSAGE]: (state, { payload: message }) => ({
        ...state,
        messages: [ ...state.messages, message ],
    })
}
, initialState);