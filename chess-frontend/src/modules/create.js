import { createAction, handleActions } from 'redux-actions';

const CHANGE_FIELD = 'create/CHANGE_FIELD';
export const changeField = createAction(CHANGE_FIELD, payload => payload);

const initialState = {
    map: 'Classical',
    mapList: ['Classical', 'Crazy House', 'Racing Kings'],
    type: 'Normal',
    typeList: ['Normal', 'Rank'],
    defaultTime: 15,
    extraTime: 15,
    piece: null,
};

export default handleActions({
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,
    }),
}, initialState);