import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, take } from 'redux-saga/effects';

const INITIALIZE_WEBSOCKET = 'chat/INITIALIZE_WEBSOCKET';
const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';

export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);

function* createEventChannel(socket) {
    return eventChannel(emit => {
        socket.onmessage = message => emit(message.data);
        return () => {
            socket.close();
        }
    })
}

function* initializeWebsocketSaga () {
    const socket = new WebSocket('ws://localhost:4000', 'protocol');
    console.dir('소켓 연결했을까');
    const channel = yield call(createEventChannel, socket);
    while(true) {
        const message = yield take(channel);
        yield put({ type: WEBSOCKET_ONMESSAGE, message});
    }
}

export function* chatSaga () {
    yield takeEvery(INITIALIZE_WEBSOCKET, initializeWebsocketSaga);
}

const initialState = {
    connection: false,
    message: null,
};

export default handleActions({
    [WEBSOCKET_ONMESSAGE]: (state, { message }) => ({
        ...state,
        message,
    }),
}
, initialState);