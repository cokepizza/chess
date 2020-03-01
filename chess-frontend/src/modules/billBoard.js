import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import { genClearBoard } from '../lib/base/genBoard';
import { connectNamespace } from '../lib/websocket/websocket';

const CONNECT_WEBSOCKET = 'billBoard/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'billBoard/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_VALUE = 'billBoard/INITIALIZE_VALUE';
const INITIALIZE_SOCKET = 'billBoard/INITIALIZE_SOCKET';
const CLEAR_VALUE = 'billBoard/CLEAR_VALUE';
const CHANGE_VALUE = 'billBoard/CHANGE_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);
export const changeValue = createAction(CHANGE_VALUE);

export const changeValueThunk = ({ roomKey, move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { billBoard: { boards },
        } = getState();

    const board = boards[roomKey];
    if(!board) return;

    const cell = board[prev.y][prev.x];
    const clearBoard = genClearBoard([...board], [
        'tracked',
    ]);
    
    clearBoard[next.y] = [ ...clearBoard[next.y] ];
    clearBoard[next.y][next.x] = {
        ...cell,
        tracked: true,
        dirty: true,
    };

    clearBoard[prev.y]= [ ...clearBoard[prev.y] ];
    clearBoard[prev.y][prev.x] = {
        tracked: true,
    };

    //  promotion
    const { owner, piece } = clearBoard[next.y][next.x];
    if((owner === 'white' && piece === 'pawn' && next.y === 0) || (owner === 'black' && piece === 'pawn' && next.y === 7)) {
        clearBoard[next.y][next.x] = {
            ...clearBoard[next.y][next.x],
            piece: 'queen',
        }
    };

    //  castling
    if(clearBoard[next.y][next.x].piece === 'king') {
        if(next.x - prev.x === 2) {
            clearBoard[prev.y] = [ ...clearBoard[prev.y] ];
            
            const pieceStore = { ...clearBoard[prev.y][prev.x+3] };
            clearBoard[prev.y][prev.x+3] = {};
            clearBoard[prev.y][prev.x+1] = {
                ...pieceStore,
                dirty: true,
            };
        }

        if(next.x - prev.x === -2) {
            clearBoard[prev.y] = [ ...clearBoard[prev.y] ];

            const pieceStore = { ...clearBoard[prev.y][prev.x-4] };
            clearBoard[prev.y][prev.x-4] = {};
            clearBoard[prev.y][prev.x-1] = {
                ...pieceStore,
                dirty: true,
            };
        }
    };
    
    const revisedBoards = [ ...boards.slice(0, roomKey), clearBoard, ...boards.slice(roomKey+1) ];

    dispatch(changeValue({
        boards: revisedBoards,
    }));
}

function* connectWebsocketSaga (action) {
    const query = action.payload;

    const socketTask = yield fork(connectNamespace, { 
        url: '/billBoard',
        initializeSocket,
        initializeValue,
        changeValue: changeValueThunk,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* billBoardSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

const initialState = {
    boards: [null, null, null, null],
    informs: [null, null, null, null],
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, roomKey, inform, board }}) => ({
        ...state,
        boards: [ ...state.boards.slice(0, roomKey), board, ...state.boards.slice(roomKey+1) ],
        informs: [ ...state.informs.slice(0, roomKey), inform, ...state.informs.slice(roomKey+1) ],
    }),
    [CHANGE_VALUE]: (state, { payload: { boards } }) => ({
        ...state,
        boards,
    }),
    [CLEAR_VALUE]: state => initialState,
}, initialState);