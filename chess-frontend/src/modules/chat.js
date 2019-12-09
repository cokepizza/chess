// import { createAction, handleActions } from 'redux-actions';
// import { eventChannel } from 'redux-saga';
// import { takeEvery, put, call, take } from 'redux-saga/effects';

// function* createEventChannel(socket) {

// }

// function* initializeWebsocket () {
//     const socket = new WebSocket('ws://localhost:4000', 'protocol');
//     const channel = yield call(createEventChannel, socket);
//     while(true) {
//         const { message } = yield take(channel);
//         yield put({ type: WEBSOCKET_ONMESSAGE }, message);
//     }
// }

// export function* chatSaga () {
//     yield [
//         takeEvery('INITIALIZE_WEBSOCKET', initializeWebsocket),
//     ]
// }

// const initialState = {};

// export default handleActions({

// }
// , initialState);