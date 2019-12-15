import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import canvas from './canvas';
import chat from './chat';
import auth from './auth';
import room, { roomSaga } from './room';
import game, { gameSaga } from './game';


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
