import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import { connectNamespace } from '../lib/websocket/websocket';

const CONNECT_WEBSOCKET = 'record/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'record/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'record/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'record/INITIALIZE_SOCKET';
const CHANGE_VALUE = 'record/CHANGE_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);

export const changeValueThunk = props => ( dispatch, getState ) => {
    const {
        record: { record }
    } = getState();

    const newRecord = { ...record };
    Object.keys(props).forEach(key => {
        if(newRecord.hasOwnProperty(key)) {
            newRecord[key] = props[key];
        }
    });

    dispatch(changeValue({ record: newRecord }));
};

function* connectWebsocketSaga (action) {
    const key = action.payload;
    
    const query = `key=${key}`;

    const socketTask = yield fork(connectNamespace, { 
        url: '/record',
        initializeSocket,
        initializeValue,
        changeValue: changeValueThunk,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* recordSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    socket: null,
    record: null,
    error: null,
}

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { record } }) => ({
        ...state,
        record,
    }),
    [CHANGE_VALUE]: (state, { payload: { record } }) => ({
        ...state,
        record,
    })
}, initialState);
