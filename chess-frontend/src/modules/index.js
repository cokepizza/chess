import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import room, { roomSaga } from './room';
import auth, { authSaga } from './auth';
import game, { gameSaga } from './game';
import canvas, { canvasSaga } from './canvas';
import chat, { chatSaga } from './chat';
import record, { recordSaga }  from './record';


const rootReducer = combineReducers({
    room,
    auth,
    game,
    canvas,
    chat,
    record,
})


export function* rootSaga() {
    yield all([ roomSaga(), authSaga(), gameSaga(), canvasSaga(), chatSaga(), recordSaga() ]);
};

export default rootReducer;
