import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import canvas from './canvas';
import chat, { chatSaga } from './chat';

const rootReducer = combineReducers({
    canvas,
    chat,
})


export function* rootSaga() {
    yield all([ chatSaga() ]);
};

export default rootReducer;
