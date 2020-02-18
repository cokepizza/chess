import { handleActions, createAction } from 'redux-actions';

const SET_MENU = 'community/SET_MENU';
const SET_STATUS = 'community/SET_STATUS';
export const setMenu = createAction(SET_MENU, payload => payload);
export const setStatus = createAction(SET_STATUS, payload => payload);

export const setMenuThunk = index => (dispatch, getState) => {
    const {
        community: { menu },
    } = getState();

    const checkedIndex = menu.findIndex(criteria => criteria.checked);
    if(index === checkedIndex) return;

    const revisedMenu = menu.map(criteria => criteria.checked
        ? { ...criteria, checked: false }
        : criteria
    );

    revisedMenu[index] = {
        ...revisedMenu[index],
        checked: true,
    }

    dispatch(setMenu({
        menu: revisedMenu,
    }))
};

const initialState = {
    status: 'list',
    menu: [
        {
            name: 'All Posts',
            checked: true,
        },
        {
            name: 'Small Talk',
            checked: false,
        },
        {
            name: 'Know How',
            checked: false,
        },
        {
            name: 'Notice',
            checked: false,
        },
    ],
    list: {
        page: 0,
        summary: ['haha', 'hoho'],
    },
    post: {
        title: null,
        content: null,
    },
    write: {
        title: 'sad',
        content: 'happy',
    }
};


export default handleActions({
    [SET_MENU]: (state, { payload: { menu } }) => ({
        ...state,
        menu,
    }),
    [SET_STATUS]: (state, { payload: { status } }) => ({
        ...state,
        status,
    })
}, initialState);