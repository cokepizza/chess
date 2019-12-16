import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import canvas, { canvasSaga } from './canvas';
import chat, { chatSaga } from './chat';
import auth, { authSaga } from './auth';
import room, { roomSaga } from './room';


const rootReducer = combineReducers({
    auth,
    canvas,
    chat,
    room,
})


export function* rootSaga() {
    yield all([ authSaga(), canvasSaga(), chatSaga(), roomSaga() ]);
};

export default rootReducer;
