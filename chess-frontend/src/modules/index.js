import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import canvas from './canvas';
import chat, { chatSaga } from './chat';
import auth from './auth';

const rootReducer = combineReducers({
    canvas,
    chat,
    auth,
})


export function* rootSaga() {
    yield all([ chatSaga() ]);
};

export default rootReducer;
