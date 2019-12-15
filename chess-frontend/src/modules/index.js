import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
// import canvas, { canvasSaga } from './canvas';
import canvas from './canvas';
import chat, { chatSaga } from './chat';
import auth, { authSaga } from './auth';
import room, { roomSaga } from './room';


const rootReducer = combineReducers({
    canvas,
    chat,
    auth,
    room,
})


export function* rootSaga() {
    yield all([ authSaga(), chatSaga(), roomSaga() ]);
};

export default rootReducer;
