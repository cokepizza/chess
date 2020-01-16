import { createAction, handleActions } from 'redux-actions';

const CHANGE_FIELD = 'create/CHANGE_FIELD';
const CLEAR_FIELD = 'create/CLEAR_FIELD';
export const changeField = createAction(CHANGE_FIELD, payload => payload);
export const clearField = createAction(CLEAR_FIELD, payload => payload);

const initialState = {
    map: 'Classical',
    mapList: ['Classical', 'Crazy House', 'Racing Kings'],
    mode: 'Normal',
    modeList: ['Normal', 'Rank'],
    defaultTime: 15,
    extraTime: 30,
    config: {
        defaultTime: {
            min: 1,
            max: 30,
            step: 1,
        },
        extraTime: {
            min: 0,
            max: 60,
            step: 5,
        }
    },
    piece: 'white',
};

export default handleActions({
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,
    }),
    [CLEAR_FIELD]: state => initialState,
}, initialState);