import { createAction, handleActions } from 'redux-actions';
import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as roomCtrl from '../lib/api/room';

const [ READ_ROOM, READ_ROOM_SUCCESS, READ_ROOM_FAILURE ] = createRequestActionTypes('room/GET_ROOM_LIST');
export const readRoomThunk = createRequestThunk(READ_ROOM, roomCtrl.getRoomList);

const initialState = {
    room: null,
    error: null,
}

export default handleActions({
    [READ_ROOM_SUCCESS]: (state, { payload: room }) => ({
        ...state,
        room,
    }),
    [READ_ROOM_FAILURE]: (state, { payload: error }) => ({
        ...state,
        error,
    }),
}, initialState);