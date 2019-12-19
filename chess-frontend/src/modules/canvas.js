import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import { connectNamespace } from '../lib/websocket/websocket';
import * as canvasCtrl from '../lib/api/canvas';

import rules from '../lib/base/rules';
import board from '../lib/base/board'

const CONNECT_WEBSOCKET = 'canvas/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'canvas/DISCONNECT_WEBSOCKET';
const INITIALIZE_SOCKET = 'canvas/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'canvas/INITIALIZE_VALUE';
const CHANGE_VALUE = 'canvas/CHANGE_VALUE';

export const connectWebsocket = createAction(CONNECT_WEBSOCKET, payload => payload);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);

const [ SET_MOVE_PIECE, SET_MOVE_PIECE_SUCCESS, SET_MOVE_PIECE_FAILURE ] = createRequestActionTypes('chat/SET_MOVE_PIECE');
export const setMovePieceThunk = createRequestThunk(SET_MOVE_PIECE, canvasCtrl.movePiece);

export const changeValueThunk = ({ move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { canvas: { board } } = getState();
    const cell = board[prev.y][prev.x];
    const clearBoard = genClearBoard([...board]);
    clearBoard[next.y][next.x] = {
        ...cell,
    }
    clearBoard[prev.y][prev.x] = {
        covered: false
    };
    dispatch(changeValue({ board: clearBoard, clicked: null }));
}

// const genClearBoard = board => 
//     board.map(rowArr =>
//         rowArr.map(cell =>
//             ({
//                 ...cell,
//                 covered: false,
//             })
//         )
//     );


const genClearBoard = board => {
    const arr = [];

    const leng = board.length;
    for(let i=0; i<leng; ++i) {
        for(let j=0; j<leng; ++j) {
            if(board[i][j].covered) {
                arr.push({
                    y: i,
                    x: j,
                })
            }
        }
    }
    arr.forEach(cell => {
        board[cell.y] = [ ...board[cell.y]];
        const popedCell = board[cell.y][cell.x];
        board[cell.y].splice(cell.x, 1, {
            ...popedCell,
            covered: false,
        })
    });

    return board;
}

function* connectWebsocketSaga (action) {
    const key = action.payload;
    
    const query = `key=${key}`;

    const socketTask = yield fork(connectNamespace, {
        url: '/canvas',
        initializeSocket,
        initializeValue,
        changeValue: changeValueThunk,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* canvasSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

export const clickPieceThunk = ({ board, clicked, y, x, turn }) => (dispatch, getState) => {
    if(clicked && board[y][x].covered) {
        const { canvas: { socket } } = getState();

        dispatch(setMovePieceThunk({
            socket,
            move: {
                prev: clicked,
                next: {y, x}
            }
        }));
        
        return;
    }

    const { piece, owner } = board[y][x];
    let inform = { board, y, x, turn, owner }
    if(!piece) return;

    const { type, move }= rules[piece];
    let coveredAxis = [];

    if(type === 'onetime') {
        coveredAxis = move.reduce((acc, cur) => {
            const dy = y + (owner === 'black' ? -cur.dy: +cur.dy);
            const dx = x + cur.dx;
            if(dy < 0 || dx < 0 || dy > 7 || dx > 7) return acc;
            
            inform = { ...inform, dy, dx };
            if(!cur.except || (cur.except && cur.except(inform))) {
                if(!board[dy][dx].owner || board[y][x].owner !== board[dy][dx].owner) {
                    acc.push({dy, dx});
                }
            }

            return acc;
        }, []);
    } else {
        coveredAxis = move.flatMap(cur => {
            let counter = 0;
            let coveredArr = [];
            while(true) {
                ++counter;
                const dy = y + counter * (owner === 'black' ? -cur.dy: +cur.dy);
                const dx = x + counter * cur.dx;
                
                if(dy < 0 || dx < 0 || dy > 7 || dx > 7) break;
                if(board[dy][dx].owner && board[dy][dx].owner === owner) break;
                coveredArr.push({dy, dx});
                if(board[dy][dx].owner && board[dy][dx].owner !== owner) break;
            }
            return coveredArr;
        });
    }

    // const clearBoard = genClearBoard(board);

    // coveredAxis.forEach(axis => {
    //     clearBoard[axis.dy][axis.dx].covered = true;
    // });


    const clearBoard = genClearBoard([...board]);

    coveredAxis.forEach(axis => {
        clearBoard[axis.dy][axis.dx] = {
            ...clearBoard[axis.dy][axis.dx],
            covered: true,
        }
    });

    dispatch(changeValue({ board: clearBoard, clicked: { y, x } }));
};

const initialState = {
    socket: null,
    moved: null,
    error: null,
    clicked: null,
    board,
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { board } }) => ({
        ...state,
        board,
    }),
    [CHANGE_VALUE]: (state, { payload : { board, clicked } }) => ({
        ...state,
        board,
        clicked,
    }),
    [SET_MOVE_PIECE_SUCCESS]: state => state,
    [SET_MOVE_PIECE_FAILURE]: state => state,
}, initialState);