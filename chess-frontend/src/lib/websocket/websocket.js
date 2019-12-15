import { eventChannel } from 'redux-saga';
import SocketIo from 'socket.io-client';
import { takeEvery, fork, put, call, take, cancel, cancelled } from 'redux-saga/effects';

function* createEventChannel(io) {
    return eventChannel(emit => {

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

export function* initializeNamespace(url) {
    let channel;

    try {
        const io = SocketIo(url);
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