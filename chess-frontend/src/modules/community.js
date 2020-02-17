import { handleActions, createAction } from 'redux-actions';

const SET_COMMUNITY = 'community/SET_COMMUNITY';
export const setCommunity = createAction(SET_COMMUNITY, payload => payload);

export const checkChangeThunk = index => (dispatch, getState) => {
    const {
        community: { community },
    } = getState();

    const checkedIndex = community.findIndex(commun => commun.checked);
    if(index === checkedIndex) return;

    const revisedCommunity = community.map(commun => commun.checked
        ? { ...commun, checked: false }
        : commun
    );

    revisedCommunity[index] = {
        ...revisedCommunity[index],
        checked: true,
    }

    dispatch(setCommunity({
        community: revisedCommunity,
    }))
    console.dir(community);
};

const initialState = {
    community: [
        {
            name: 'All Posts',
            checked: true,
            page: 0,
            content: ['하하하하', '호호호호'],
        },
        {
            name: 'Small Talk',
            checked: false,
            page: 0,
            content: [],
        },
        {
            name: 'Know How',
            checked: false,
            page: 0,
            content: [],
        },
        {
            name: 'Notice',
            checked: false,
            page: 0,
            content: [],
        },
    ],
};


export default handleActions({
    [SET_COMMUNITY]: (state, { payload: { community } }) => ({
        ...state,
        community,
    }),
}, initialState);