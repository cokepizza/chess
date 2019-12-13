import { createAction, handleActions } from 'redux-actions';
import * as authAPI from '../lib/api/auth';

//  saga 요청방식
// import { takeLatest } from 'redux-saga/effects';
// import createRequestSaga, { createRequestActionTypes } from '../lib/createRequsetSaga';
// export const setSession = createAction(SET_SESSION);
// const setSessionSaga = createRequestSaga(SET_SESSION, authAPI.getSession);
// export function* authSaga() {
//     yield takeLatest(SET_SESSION, setSessionSaga);
// }

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

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