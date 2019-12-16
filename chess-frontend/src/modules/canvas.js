import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import createRequestThunk from '../lib/createRequestThunk';
import { connectNamespace } from '../lib/websocket/websocket';
import * as canvasCtrl from '../lib/api/canvas';

import rules from '../lib/base/rules';
import board from '../lib/base/board'

const CONNECT_WEBSOCKET = 'canvas/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'canvas/DISCONNECT_WEBSOCKET';
const CHANGE_VALUE = 'canvas/CHANGE_VALUE';
const SET_MOVE_PIECE = 'canvas/SET_MOVE_PIECE';

export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);

export const setMovePieceThunk = createRequestThunk(SET_MOVE_PIECE, canvasCtrl.movePiece);
export const changeValueThunk = ({ move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { canvas: { board } } = getState();
    const cell = board[prev.y][prev.x];
    const clearBoard = genClearBoard(board);
    clearBoard[next.y][next.x] = {
        ...cell,
    }
    clearBoard[prev.y][prev.x] = { covered: false };
    dispatch(changeValue({ board: clearBoard, clicked: null }));
}

const genClearBoard = board => 
    board.map(rowArr =>
        rowArr.map(cell =>
            ({
                ...cell,
                covered: false,
            })
        )
    );

function* connectWebsocketSaga () {
    const socketTask = yield fork(connectNamespace, {
        url: '/canvas',
        changeValue: changeValueThunk,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* canvasSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

export const clickPiece = ({ board, clicked, y, x, turn }) => dispatch => {
    if(clicked && board[y][x].covered) {
        
        dispatch(setMovePieceThunk({ 
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

    const clearBoard = genClearBoard(board);

    coveredAxis.forEach(axis => {
        clearBoard[axis.dy][axis.dx].covered = true;
    });

    dispatch(changeValue({ board: clearBoard, clicked: { y, x } }));
};

const initialState = {
    moved: null,
    error: null,
    clicked: null,
    board,
};

export default handleActions({
    [CHANGE_VALUE]: (state, { payload : { board, clicked } }) => ({
        ...state,
        board,
        clicked,
    }),
}, initialState);