import { createAction, handleActions } from 'redux-actions';

const CHANGE_FIELD = 'create/CHANGE_FIELD';
export const changeField = createAction(CHANGE_FIELD, payload => payload);

const initialState = {
    map: 'Classical',
    mapList: ['Classical', 'Crazy House', 'Racing Kings'],
    type: 'Normal',
    typeList: ['Normal', 'Rank'],
    defaultTime: 15,
    extraTime: 30,
    config: {
        defaultTime: {
            min: 1,
            max: 30,
            step: 1,
            defaultValue: 15,
        },
        extraTime: {
            min: 0,
            max: 60,
            step: 5,
            defaultValue: 30,
        }
    },
    piece: 'white',
};

export default handleActions({
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,
    }),
}, initialState);