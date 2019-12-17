import { eventChannel } from 'redux-saga';
import SocketIo from 'socket.io-client';
import { put, call, take, cancelled } from 'redux-saga/effects';

// eslint-disable-next-line
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

export function* connectNamespace(params) {
    let channel;

    const {
        url,
        initializeValue,
        changeValue,
        query,
    } = params;

    try {
        console.dir(url);
        console.dir(query);
        const io = SocketIo(url, {
            query,
            reconnection: false,
        });
        channel = yield call(createEventChannel, io);
    
        while(true) {
            const message = yield take(channel);
            if(message.type === 'initialize') {
                yield put(initializeValue(message));
            } else if(message.type === 'change') {
                yield put(changeValue(message));
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