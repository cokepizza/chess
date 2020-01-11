import { createAction, handleActions } from 'redux-actions';
import { connectNamespace } from '../lib/websocket/websocket';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import produce from 'immer';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as authAPI from '../lib/api/auth';
import { setLocalStorage, clearLocalStorage } from '../lib/storage/storage';

const CONNECT_WEBSOCKET = 'auth/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'auth/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_SOCKET = 'auth/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'auth/INITIALIZE_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);

const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('auth/SET_SESSION');
export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

const [ LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE ] = createRequestActionTypes('auth/LOGIN');
const [ REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE ] = createRequestActionTypes('auth/REGISTER');
const [ LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE ] = createRequestActionTypes('auth/LOGOUT');
const [ CHECK, CHECK_SUCCESS, CHECK_FAILURE ] = createRequestActionTypes('auth/CHECK');
export const loginThunk = createRequestThunk(LOGIN, authAPI.login);
export const registerThunk = createRequestThunk(REGISTER, authAPI.register);
export const logoutThunk = createRequestThunk(LOGOUT, authAPI.logout);
export const checkThunk = createRequestThunk(CHECK, authAPI.check);

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const CLEAR_FIELD = 'auth/CLEAR_FIELD';
const CLEAR_SPECIFIC_FIELD = 'auth/CLEAR_SPECIFIC_FIELD';
export const changeField = createAction(CHANGE_FIELD, payload => payload);
export const clearField = createAction(CLEAR_FIELD, payload => payload);
export const clearSpecificField = createAction(CLEAR_SPECIFIC_FIELD, payload => payload);

export const loginProcessThunk = param => async ( dispatch, getState ) => {
    try {
        const auth = await dispatch(loginThunk(param));
        if(auth) {
            setLocalStorage({ auth });
        }
    } catch(e) {
        console.dir('Login failed');
    }
    
}

export const registerProcessThunk = param => async ( dispatch, getState ) => {
    try {
        const auth = await dispatch(registerThunk(param));
        if(auth) {
            setLocalStorage({ auth });
        }
    } catch(e) {
        console.dir('Register failed');
    }
    
}

export const logoutProcessThunk = () => async( dispatch, getState ) => {
    try {
        await dispatch(logoutThunk());
        clearLocalStorage('auth');
    } catch(e) {
        console.dir('Logout failed');
    }
}

function* connectWebsocketSaga (action) {
    const key = action.payload;
        
    const query = `key=${key}`;
    
    const socketTask = yield fork(connectNamespace, {
        url: '/auth',
        initializeSocket,
        initializeValue,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* authSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

//  session 정보와 socket정보가 혼재되어 있는 reducer
//  tempAuth의 경우 key로 소켓마다 가지고 있는 정보
const initialState = {
    socket: null,
    tempAuth: null,
    session: null,
    error: null,
    auth: null,
    authError: null,
    login: {
        username: '',
        password: '',
    },
    register: {
        username: '',
        password: '',
        passwordConfirm: '',
    }
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        tempAuth: { ...rest },
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
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
        produce(state, draft => {
            draft[form][key] = value;
        }),
    [CLEAR_FIELD]: (state, { payload: { form } }) => ({
        ...state,
        [form]: initialState[form],
        authError: initialState.authError,
    }),
    [CLEAR_SPECIFIC_FIELD]: (state, { payload: { form, key } }) => ({
        ...state,
        [form]: {
            ...state[form],
            [key]: initialState[form][key],
        },
        authError: initialState.authError,
    }),
    [LOGIN_SUCCESS]: (state, { payload : auth }) => ({
        ...state,
        auth,
        authError: null,
    }),
    [LOGIN_FAILURE]: (state, { payload: authError }) => ({
        ...state,
        auth: null,
        authError,
    }),
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
        ...state,
        auth,
        authError: null,
    }),
    [REGISTER_FAILURE]: (state, { payload: authError }) => ({
        ...state,
        auth: null,
        authError,
    }),
    [LOGOUT_SUCCESS]: state => ({
        ...state,
        auth: null,
        authError: null,
    }),
    [LOGOUT_FAILURE]: ( state, { payload: authError }) => ({
        ...state,
        auth: null,
        authError,
    }),
    [CHECK_SUCCESS]: ( state, { payload: auth }) => ({
        ...state,
        auth,
        authError: null,
    }),
    [CHECK_FAILURE]: ( state, { payload: authError }) => ({
        ...state,
        auth: null,
        authError,
    })
}, initialState);