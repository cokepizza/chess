import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
// import createRequestSaga, { createRequestActionTypes } from '../lib/createRequsetSaga';\
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('auth/SET_SESSION');
// export const setSession = createAction(SET_SESSION);
// const setSessionSaga = createRequestSaga(SET_SESSION, authAPI.getSession);
export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

// export function* authSaga() {
//     yield takeLatest(SET_SESSION, setSessionSaga);
// }

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