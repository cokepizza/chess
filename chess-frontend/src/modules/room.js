import { createAction, handleActions } from 'redux-actions';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as roomCtrl from '../lib/api/room';

const SET_ROOM = 'room/SET_ROOM';
const [ READ_ROOM, READ_ROOM_SUCCESS, READ_ROOM_FAILURE ] = createRequestActionTypes('room/READ_ROOM');
const [ CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE ] = createRequestActionTypes('/room/CREATE_ROOM');

export const setRoom = createAction(SET_ROOM, payload => payload);
export const readRoomThunk = createRequestThunk(READ_ROOM, roomCtrl.readRoom);
export const createRoomThunk = createRequestThunk(CREATE_ROOM, roomCtrl.createRoom);

const initialState = {
    room: null,
    error: null,
}

export default handleActions({
    [READ_ROOM_SUCCESS]: state => state,
    [READ_ROOM_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
    [CREATE_ROOM_SUCCESS]: state => state,
    [CREATE_ROOM_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
    [SET_ROOM]: (state, { payload: { type, room } }) => ({
        ...state,
        room,
    }),
}, initialState);