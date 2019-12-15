import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import canvas from './canvas';
import chat, { chatSaga } from './chat';
import auth from './auth';
import room from './room';

const rootReducer = combineReducers({
    canvas,
    chat,
    auth,
    room,
})


export function* rootSaga() {
    yield all([ chatSaga() ]);
};

export default rootReducer;
