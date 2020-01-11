import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import game, { gameSaga } from './game';
import games, { gamesSaga } from './games';
import auth, { authSaga } from './auth';
import canvas, { canvasSaga } from './canvas';
import chat, { chatSaga } from './chat';
import record, { recordSaga }  from './record';


const rootReducer = combineReducers({
    auth,
    game,
    games,
    canvas,
    chat,
    record,
})


export function* rootSaga() {
    yield all([ authSaga(), gameSaga(), gamesSaga(), canvasSaga(), chatSaga(), recordSaga() ]);
};

export default rootReducer;
