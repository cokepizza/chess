import { handleActions, createAction } from 'redux-actions';
import * as communityCtrl from '../lib/api/community';
import  createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

const CLEAR_ALL = 'community/CLEAR_ALL';
const SET_MENU = 'community/SET_MENU';
const SET_STATUS = 'community/SET_STATUS';
const SET_FORM = 'community/SET_FORM';
const CLEAR_FORM = 'community/CLEAR_FORM';
const CLEAR_FORM_ALL = 'community/CLEAR_FORM_ALL';
const [ CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE ] = createRequestActionTypes('community/CREATE_POST');
const [ LIST_POST, LIST_POST_SUCCESS, LIST_POST_FAILURE ] = createRequestActionTypes('community/LIST_POST');
const [ READ_POST, READ_POST_SUCCESS, READ_POST_FAILURE ] = createRequestActionTypes('community/READ_POST');
const [ DELETE_POST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE ] = createRequestActionTypes('community/DELETE_POST');
const [ UPDATE_POST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE ] = createRequestActionTypes('community/UPDATE_POST');
export const clearAll = createAction(CLEAR_ALL);
export const setMenu = createAction(SET_MENU, payload => payload);
export const setStatus = createAction(SET_STATUS, payload => payload);
export const setForm = createAction(SET_FORM, payload => payload);
export const clearForm = createAction(CLEAR_FORM, payload => payload);
export const clearFormAll = createAction(CLEAR_FORM_ALL, payload => payload);
export const createPostThunk = createRequestThunk(CREATE_POST, communityCtrl.createPost);
export const listPostThunk = createRequestThunk(LIST_POST, communityCtrl.listPost);
export const readPostThunk = createRequestThunk(READ_POST, communityCtrl.readPost);
export const deletePostThunk = createRequestThunk(DELETE_POST, communityCtrl.deletePost);
export const updatePostThunk = createRequestThunk(UPDATE_POST, communityCtrl.updatePost);

export const setMenuThunk = index => (dispatch, getState) => {
    const {
        community: { menu },
    } = getState();

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
        id: null,
        post: null,
    },
    write: {
        modify: false,
        title: '',
        content: '',
    }
};


export default handleActions({
    [CLEAR_ALL]: state => initialState,
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
    [CLEAR_FORM]: (state, { payload: { status, key } }) => ({
        ...state,
        [status]: {
            ...state[status],
            [key]: initialState[status][key],
        }
    }),
    [CLEAR_FORM_ALL]: (state, { payload: { status } }) => ({
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
    [READ_POST_SUCCESS]: (state, { payload: { post } }) => ({
        ...state,
        post: {
            ...state.post,
            post,
        }
    }),
    [READ_POST_FAILURE]: state => state,
    [DELETE_POST_SUCCESS]: state => state,
    [DELETE_POST_FAILURE]: state => state,
    [UPDATE_POST_SUCCESS]: state => state,
    [UPDATE_POST_FAILURE]: state => state,
}, initialState);