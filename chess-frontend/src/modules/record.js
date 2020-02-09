import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import { connectNamespace } from '../lib/websocket/websocket';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as recordAPI from '../lib/api/record';

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
const CLEAR_TOOLTIP = 'record/CLEAR_TOOLTIP';
const SET_REQUEST_MODAL = 'record/SET_REQUEST_MODAL';
const SET_REQUEST_MESSAGE = 'record/SET_REQUEST_MESSAGE';
const SET_BANCLICK = 'record/SET_BANCLICK';
const SET_SHOWINDEX = 'record/SET_SHOWINDEX';
export const changeReverse = createAction(CHANGE_REVERSE, payload => payload);
export const clearToolTip = createAction(CLEAR_TOOLTIP);
export const setRequestModal = createAction(SET_REQUEST_MODAL, payload => payload);
export const setRequestMessage = createAction(SET_REQUEST_MESSAGE, payload => payload);
export const setBanClick = createAction(SET_BANCLICK);
export const setShowIndex = createAction(SET_SHOWINDEX, payload => payload);

const [ ASKING, ASKING_SUCCESS, ASKING_FAILURE ] = createRequestActionTypes('record/ASKING');
const [ ANSWERING, ANSWERING_SUCCESS, ANSWERING_FAILURE ] = createRequestActionTypes('record/ANSWERING');
export const askingThunk = createRequestThunk(ASKING, recordAPI.asking);
export const answeringThunk = createRequestThunk(ANSWERING, recordAPI.answering);

export const notifyRequestThunk = ({ genre: type, modal, open, message }) => ( dispatch, getState ) => {
    if(open) {
        if(!message) {
            //  modal open
            dispatch(setRequestModal({
                type,
                modal,
            }));
        } else {
            //  modal message
            dispatch(setRequestMessage({
                type,
                message,
            }));
        }
        
    } else {
        //  modal close
        dispatch(clearToolTip());
    }
    
};

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
    const query = action.payload;

    const socketTask = yield fork(connectNamespace, { 
        url: '/record',
        initializeSocket,
        initializeValue,
        changeValue,
        updateValue: updateValueThunk,
        notifyRequest: notifyRequestThunk,
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
    blocked: false,
    banClick: false,
    showIndex: null,
    replayMode: false,
    undo: {
        message: null,
        modal: null,
    },
    draw: {
        message: null,
        modal: null,
    },
    surrender: {
        message: null,
        modal: null,
    },
}

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        ...rest,
        showIndex: rest.pieceMove.length - 1,
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
    }),
    [SET_SHOWINDEX]: (state , { payload: { showIndex, replayMode }}) => ({
        ...state,
        showIndex,
        replayMode,
    }),
    [ASKING]: state => state,
    [ASKING_SUCCESS]: state => state,
    [ASKING_FAILURE]: state => state,
    [ANSWERING]: state => state,
    [ANSWERING_SUCCESS]: state => state,
    [ANSWERING_FAILURE]: state => state,
    [CLEAR_TOOLTIP]: (state) => ({
        ...state,
        undo: initialState['undo'],
        draw: initialState['draw'],
        surrender: initialState['surrender'],
        blocked: false,
        banClick: false,
    }),
    [SET_BANCLICK]: (state) => ({
        ...state,
        banClick: true,
    }),
    [SET_REQUEST_MODAL]: (state, { payload: { type, modal } }) => ({
        ...state,
        [type]: {
            ...state[type],
            modal,
        },
        blocked: true,
    }),
    [SET_REQUEST_MESSAGE]: (state, { payload: { type, message } }) => ({
        ...state,
        [type]: {
            ...state[type],
            message,
        },
        blocked: true,
    }),
}, initialState);
