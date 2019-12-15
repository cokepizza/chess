import { createAction, handleActions } from 'redux-actions';
import { eventChannel } from 'redux-saga';
import SocketIo from 'socket.io-client';
import { takeEvery, fork, put, call, take, cancel, cancelled } from 'redux-saga/effects';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as authAPI from '../lib/api/auth';

const INITIALIZE_VALUE = 'auth/INITIALIZE_VALUE';
const CONNECT_WEBSOCKET = 'auth/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'auth/DISCONNECT_WEBSOCKET';

export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

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
        const io = SocketIo('/');
        channel = yield call(createEventChannel, io);
    
        while(true) {
            const message = yield take(channel);
            yield put(initializeValue(message));
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

export function* authSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

//  saga 요청방식
// import { takeLatest } from 'redux-saga/effects';
// import createRequestSaga, { createRequestActionTypes } from '../lib/createRequsetSaga';
// export const setSession = createAction(SET_SESSION);
// const setSessionSaga = createRequestSaga(SET_SESSION, authAPI.getSession);
// export function* authSaga() {
//     yield takeLatest(SET_SESSION, setSessionSaga);
// }

const SET_TEMPORARY_AUTH = 'auth/SET_TEMPORARY_AUTH';
const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('auth/SET_SESSION');

export const setTemporaryAuth = createAction(SET_TEMPORARY_AUTH, payload => payload);
export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

const initialState = {
    tempAuth: null,
    session: null,
    error: null,
};

export default handleActions({
    [INITIALIZE_VALUE]: (state, { payload: tempAuth }) => ({
        ...state,
        tempAuth,
    }),
    [SET_SESSION_SUCCESS]: (state, { payload: session }) => ({
        ...state,
        session,
    }),
    [SET_SESSION_FAILURE]: (state, { payload: error }) => ({
        ...state,
        session: null,
        error,
    }),
    [SET_TEMPORARY_AUTH]: (state, { payload: tempAuth }) => ({
        ...state,
        tempAuth,
    })
}, initialState);