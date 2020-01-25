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
const UPDATE_VALUE = 'record/UPDATE_VALUE';
const CLEAR_VALUE = 'record/CLEAR_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);
export const updateValue = createAction(UPDATE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

const CHANGE_REVERSE = 'record/CHANGE_REVERSE';
export const changeReverse = createAction(CHANGE_REVERSE, payload => payload);

export const updateValueThunk = params => ( dispatch, getState ) => {
    const { record } = getState();
    let newRecord = { ...record };
    Object.keys(params).forEach(key => {
        if(typeof params[key] === 'object') {
            newRecord = {
                ...newRecord,
                [key]: [
                    ...newRecord[key],
                    params[key],
                ]
            };
        }
    });

    dispatch(updateValue({ record: newRecord }));
};

function* connectWebsocketSaga (action) {
    // const key = action.payload;
    // const query = `key=${key}`;

    const query = action.payload;

    const socketTask = yield fork(connectNamespace, { 
        url: '/record',
        initializeSocket,
        initializeValue,
        changeValue,
        updateValue: updateValueThunk,
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
    error: null,
    startTime: null,
    endTime: null,
    blackTime: null,
    whiteTime: null,
    blackMaxTime: null,
    whiteMaxTime: null,
    whiteRatio: 0,
    blackRatio: 0,
    pieceMove: [],
    reversed: false,
}

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        ...rest,
    }),
    [CHANGE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        ...rest,
    }),
    [UPDATE_VALUE]: (state, { payload: { record } }) => ({
        ...record,
    }),
    [CLEAR_VALUE]: state => initialState,
    [CHANGE_REVERSE]: (state, { payload: { reversed } }) => ({
        ...state,
        reversed,
    })
}, initialState);
