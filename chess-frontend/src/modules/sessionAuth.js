import { createAction, handleActions } from 'redux-actions';
import { connectNamespace } from '../lib/websocket/websocket';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import produce from 'immer';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as authAPI from '../lib/api/auth';
import { setLocalStorage, removeLocalStorage } from '../lib/storage/storage';

const CONNECT_WEBSOCKET = 'sessionAuth/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'sessionAuth/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'sessionAuth/INITIALIZE_VALUE';
const CLEAR_VALUE = 'sessionAuth/CLEAR_VALUE';
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);

const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('sessionAuth/SET_SESSION');
export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

const [ LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE ] = createRequestActionTypes('sessionAuth/LOGIN');
const [ REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE ] = createRequestActionTypes('sessionAuth/REGISTER');
const [ LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE ] = createRequestActionTypes('sessionAuth/LOGOUT');
const [ CHECK, CHECK_SUCCESS, CHECK_FAILURE ] = createRequestActionTypes('sessionAuth/CHECK');
export const loginThunk = createRequestThunk(LOGIN, authAPI.login);
export const registerThunk = createRequestThunk(REGISTER, authAPI.register);
export const logoutThunk = createRequestThunk(LOGOUT, authAPI.logout);
export const checkThunk = createRequestThunk(CHECK, authAPI.check);

const CHANGE_FIELD = 'sessionAuth/CHANGE_FIELD';
const CLEAR_FIELD = 'sessionAuth/CLEAR_FIELD';
const CLEAR_SPECIFIC_FIELD = 'sessionAuth/CLEAR_SPECIFIC_FIELD';
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
        removeLocalStorage('auth');
    } catch(e) {
        console.dir('Logout failed');
    }
}

function* connectWebsocketSaga () {
    
    const socketTask = yield fork(connectNamespace, {
        url: '/sessionAuth',
        initializeValue,
        clearValue,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* sessionAuthSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    tempAuth: null,
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
}

export default handleActions({
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest } }) => ({
        ...state,
        auth: { ...rest },
    }),
    [CLEAR_VALUE]: state => ({
        ...initialState,
        tempAuth: state.tempAuth,
    }),
    [SET_SESSION_SUCCESS]: (state, { payload: tempAuth }) => ({
        ...state,
        tempAuth,
    }),
    [SET_SESSION_FAILURE]: (state, { payload: error }) => ({
        ...state,
        tempAuth: null,
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
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
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