import { createAction, handleActions } from 'redux-actions';
import * as authAPI from '../lib/api/auth';

// import { takeLatest } from 'redux-saga/effects';
// import createRequestSaga, { createRequestActionTypes } from '../lib/createRequsetSaga';
// export const setSession = createAction(SET_SESSION);
// const setSessionSaga = createRequestSaga(SET_SESSION, authAPI.getSession);
// export function* authSaga() {
//     yield takeLatest(SET_SESSION, setSessionSaga);
// }

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('auth/SET_SESSION');

export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

const initialState = {
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
}, initialState);