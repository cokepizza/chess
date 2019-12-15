import { createAction, handleActions } from 'redux-actions';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as chatAPI from '../lib/api/chat';
// import { setTemporaryAuth } from '../modules/auth';
// import { setBoardThunk } from '../modules/canvas';
// import { setRoom } from '../modules/room';

// const INITIALIZE_WEBSOCKET = 'chat/INITIALIZE_WEBSOCKET';
// const INITIALIZE_ROOM_WEBSOCKET = 'chat/INITIALIZE_ROOM_WEBSOCKET';
// const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';
// const ROOM_WEBSOCKET_DISCONNECT = 'chat/ROOM_WEBSOCKET_DISCONNECT';

// export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);
// export const initializeRoomWebsocket = createAction(INITIALIZE_ROOM_WEBSOCKET);
// export const roomWebsocketDisconnect = createAction(ROOM_WEBSOCKET_DISCONNECT);

const WEBSOCKET_ONMESSAGE = 'chat/WEBSOCKET_ONMESSAGE';
const CHANGE_TEXTFIELD = 'chat/CHANGE_TEXTFIELD';
const INITIALIZE_TEXTFIELD = 'chat/INITIALIZE_TEXTFIELD';
const SET_RECEIVED_MESSAGE = 'chat/SET_RECEIVED_MESSAGE';

export const changeTextfield = createAction(CHANGE_TEXTFIELD, payload => payload);
export const initializeTextfield = createAction(INITIALIZE_TEXTFIELD);
const [ SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE ] = createRequestActionTypes('chat/SEND_MESSAGE');
export const setReceivedMessage = createAction(SET_RECEIVED_MESSAGE, payload => payload);

export const sendMessageThunk = createRequestThunk(SEND_MESSAGE, chatAPI.sendMessage);

const initialState = {
    messages: [],
    text: '',
};

export default handleActions({
    [WEBSOCKET_ONMESSAGE]: (state, { payload: message }) => ({
        ...state,
        messages: [ ...state.messages, message ],
    }),
    [CHANGE_TEXTFIELD]: (state, { payload: text}) => ({
        ...state,
        text,
    }),
    [SEND_MESSAGE_SUCCESS]: (state, { payload: data }) => ({
        ...state,
    }),
    [SEND_MESSAGE_FAILURE]: (state, { payload: error }) => ({
        ...state,
    }),
    [INITIALIZE_TEXTFIELD]: state => ({
        ...state,
        text: '',
    }),
    [SET_RECEIVED_MESSAGE]: (state, { payload: message }) => ({
        ...state,
        messages: [ ...state.messages, message ],
    })
}
, initialState);