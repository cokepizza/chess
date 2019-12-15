import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import SocketIo from 'socket.io-client';
import { takeEvery, fork, put, call, take, cancel, cancelled } from 'redux-saga/effects';


const INITIALIZE_WEBSOCKET = 'game/INITIALIZE_WEBSOCKET';
export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);

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
    const io = SocketIo();
    const channel = yield call(createEventChannel, io);

    while(true) {
        const message = yield take(channel);
        if (message.type === 'auth') {
            yield put(setTemporaryAuth(message));
        } else if (message.type === 'chat') {
            yield put(setReceivedMessage(message));
        } else if (message.type === 'game') {
            yield put(setBoardThunk(message));
        } else if (message.type === 'room') {
            yield put(setRoom(message));
        }
    }
}

function* initializeRoomInstace() {
    // const io = SocketIo('ws://localhost:4000');
    // const io = SocketIo('ws://192.168.13.101:5000');
    let channel;

    try {
        const io = SocketIo('/room');
        channel = yield call(createEventChannel, io);
    
        while(true) {
            const message = yield take(channel);
            if (message.type === 'auth') {
                yield put(setTemporaryAuth(message));
            } else if (message.type === 'chat') {
                yield put(setReceivedMessage(message));
            } else if (message.type === 'game') {
                yield put(setBoardThunk(message));
            } else if (message.type === 'room') {
                yield put(setRoom(message));
            }
        }
    } catch(e) {
        console.dir(e);
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}

function* initializeRoomWebsocketSaga () {
    const socketTask = yield fork(initializeRoomInstace);
    
    yield take(ROOM_WEBSOCKET_DISCONNECT);
    yield cancel(socketTask);
}

export function* chatSaga () {
    yield takeEvery(INITIALIZE_WEBSOCKET, initializeWebsocketSaga);
    yield takeEvery(INITIALIZE_ROOM_WEBSOCKET, initializeRoomWebsocketSaga);
}

const initialState = {

};

export default handleActions({

}, initialState);