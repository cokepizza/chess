import { createAction, handleActions } from 'redux-actions';

const CHANGE_FIELD = 'create/CHANGE_FIELD';
export const changeField = createAction(CHANGE_FIELD, payload => payload);

const initialState = {
    map: 'Classical',
    mapList: ['Classical', 'Crazy House', 'Racing Kings'],
    type: 'Normal',
    typeList: ['Normal', 'Rank'],
    defaultTime: 5,
    extraTime: 10,
    config: {
        defaultTime: {
            min: 1,
            max: 30,
            step: 1,
            defaultValue: 5,
        },
        extraTime: {
            min: 0,
            max: 60,
            step: 5,
            defaultValue: 10,
        }
    },
    piece: null,
};

export default handleActions({
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,
    }),
}, initialState);