import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import game, { gameSaga } from './game';
import games, { gamesSaga } from './games';
import sessionAuth, { sessionAuthSaga } from './sessionAuth';
import socketAuth, { socketAuthSaga } from './socketAuth';
import canvas, { canvasSaga } from './canvas';
import chat, { chatSaga } from './chat';
import record, { recordSaga }  from './record';
import create from './create';
import ranking from './ranking';


const rootReducer = combineReducers({
    sessionAuth,
    socketAuth,
    game,
    games,
    canvas,
    chat,
    record,
    create,
    ranking,
})


export function* rootSaga() {
    yield all([ sessionAuthSaga(), socketAuthSaga(), gameSaga(), gamesSaga(), canvasSaga(), chatSaga(), recordSaga() ]);
};

export default rootReducer;
