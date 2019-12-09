import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, take } from 'redux-saga/effects';
import SocketIo from 'socket.io-client';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import { sendMessage } from '../lib/api';

const INITIALIZE_WEBSOCKET = 'chat/INITIALIZE_WEBSOCKET';
const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';
const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';

export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);
export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');

export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, sendMessage);

function* createEventChannel(io) {
    return eventChannel(emit => {
        // socket.onmessage = message => emit(message.data);
        io.on('message', message => emit(message));

        return () => {
            io.close();
        }
    })
}

function* initializeWebsocketSaga () {
    // const socket = new WebSocket('ws://localhost:4000', 'protocol');
    const io = SocketIo('ws://localhost:4000');
    const channel = yield call(createEventChannel, io);
    while(true) {
        const message = yield take(channel);
        yield put({ type: WEBSOCKET_ONMESSAGE, message});
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
    [WEBSOCKET_ONMESSAGE]: (state, { message }) => ({
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
}
, initialState);