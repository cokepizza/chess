import { handleActions, createAction } from 'redux-actions';
import * as communityCtrl from '../lib/api/community';
import  createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

const SET_MENU = 'community/SET_MENU';
const SET_STATUS = 'community/SET_STATUS';
const SET_FORM = 'community/SET_FORM';
const CLEAR_FORM = 'community/CLEAR_FORM';
const SET_PAGE = 'community/SET_PAGE';
const CLEAR_PAGE = 'community/CLEAR_PAGE';
const [ CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE ] = createRequestActionTypes('community/CREATE_POST');
const [ LIST_POST, LIST_POST_SUCCESS, LIST_POST_FAILURE ] = createRequestActionTypes('community/LIST_POST');
export const setMenu = createAction(SET_MENU, payload => payload);
export const setStatus = createAction(SET_STATUS, payload => payload);
export const setForm = createAction(SET_FORM, payload => payload);
export const clearForm = createAction(CLEAR_FORM, payload => payload);
export const setPage = createAction(SET_PAGE, payload => payload);
export const clearPage = createAction(CLEAR_PAGE);
export const createPostThunk = createRequestThunk(CREATE_POST, communityCtrl.createPost);
export const listPostThunk = createRequestThunk(LIST_POST, communityCtrl.listPost);

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
        page: 1,
        size: 1,
        posts: [],
    },
    post: {
        title: '',
        content: '',
    },
    write: {
        title: '',
        content: '',
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
    }),
    [SET_FORM]: (state, { payload: { status, key, value } }) => ({
        ...state,
        [status]: {
            ...state[status],
            [key]: value,
        }
    }),
    [CLEAR_FORM]: (state, { payload: { status } }) => ({
        ...state,
        [status]: {
            ...initialState[status],
        }
    }),
    [CREATE_POST_SUCCESS]: state => state,
    [CREATE_POST_FAILURE]: state => state,
    [LIST_POST_SUCCESS]: (state, { payload: { posts, size } }) => ({
        ...state,
        list: {
            ...state.list,
            posts,
            size,
        }
    }),
    [LIST_POST_FAILURE]: state => state,
    [SET_PAGE]: (state, {payload: { page }}) => ({
        ...state,
        list: {
            ...state.list,
            page,
        }
    }),
    [CLEAR_PAGE]: state => ({
        ...state,
        list: {
            ...state.list,
            page: initialState.list.page,
        }
    }),
}, initialState);