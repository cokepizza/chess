import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import _ from 'lodash';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import { connectNamespace } from '../lib/websocket/websocket';
import * as canvasCtrl from '../lib/api/canvas';

// import rules from '../lib/base/rules';
import board from '../lib/base/board';
import { checkCovered } from '../lib/base/validation';

const CONNECT_WEBSOCKET = 'canvas/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'canvas/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET, payload => payload);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_SOCKET = 'canvas/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'canvas/INITIALIZE_VALUE';
const CHANGE_VALUE = 'canvas/CHANGE_VALUE';
const CLEAR_VALUE = 'canvas/CLEAR_VALUE';
const INITIALIZE_BLOCKED = 'canvas/INITIALIZE_BLOCKED';
const CHANGE_BLOCKED = 'canvas/CHANGE_BLOCKED';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);
export const changeValue = createAction(CHANGE_VALUE, payload => payload);
export const clearValue = createAction(CLEAR_VALUE);
export const initializeBlocked = createAction(INITIALIZE_BLOCKED, payload => payload);
export const changeBlocked = createAction(CHANGE_BLOCKED, payload => payload);

const [ SET_MOVE_PIECE, SET_MOVE_PIECE_SUCCESS, SET_MOVE_PIECE_FAILURE ] = createRequestActionTypes('canvas/SET_MOVE_PIECE');
export const setMovePieceThunk = createRequestThunk(SET_MOVE_PIECE, canvasCtrl.movePiece);

const makeReverseBoard = board => {
    const reverseBoard = _.cloneDeep(board);
    reverseBoard.reverse();
    reverseBoard.forEach(row => {
        row.reverse();
    })
    
    return reverseBoard;
}

const updateReverseBoard = (prevReverseBoard, nextOriginBoard) => {
    const nextReverseBoard = makeReverseBoard(nextOriginBoard);
    prevReverseBoard = [ ...prevReverseBoard ];

    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            const nextPiece = nextReverseBoard[i][j];
            const prevPiece = prevReverseBoard[i][j];
            
            console.dir(nextPiece);
            console.dir(prevPiece);
    
            Object.keys(nextPiece).every(key => {
                console.dir(key);
                if(!prevPiece[key] || prevPiece[key] !== nextPiece[key]) {
                    console.dir(prevPiece[key]);
                    console.dir(nextPiece[key]);
                    prevReverseBoard[i] = [ ...prevReverseBoard[i] ];
                    prevReverseBoard[i][j] = {
                        ...nextPiece,
                    };
                    return false;
                }
                return true;
            });
        }
    }

    return prevReverseBoard;
};

export const changeValueThunk = ({ move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { canvas: { board, reverseBoard },
            auth: { tempAuth },
            game: { turn }
        } = getState();
    
    if(tempAuth) {
        if((tempAuth.role === 'white' && turn % 2 === 0) || (tempAuth.role === 'black' && turn % 2 === 1)) {
            dispatch(changeBlocked({ blocked: false }));
        } else {
            dispatch(changeBlocked({ blocked: true }));
        };
    }

    const cell = board[prev.y][prev.x];
    const clearBoard = genClearBoard([...board], [
        'covered',
        'clicked',
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
        covered: false,
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
            clearBoard[prev.y][prev.x+3] = {
                covered: false
            };
            clearBoard[prev.y][prev.x+1] = {
                ...pieceStore,
                dirty: true,
            };
        }

        if(next.x - prev.x === -2) {
            clearBoard[prev.y] = [ ...clearBoard[prev.y] ];

            const pieceStore = { ...clearBoard[prev.y][prev.x-4] };
            clearBoard[prev.y][prev.x-4] = {
                covered: false
            };
            clearBoard[prev.y][prev.x-1] = {
                ...pieceStore,
                dirty: true,
            };
        }
    };

    const nextReverseBoard = updateReverseBoard(reverseBoard, clearBoard);
    
    dispatch(changeValue({
        board: clearBoard,
        reverseBoard: nextReverseBoard,
        clicked: null
    }));
}

const genClearBoard = (board, params) => {
    const arr = [];

    const leng = board.length;
    for(let i=0; i<leng; ++i) {
        for(let j=0; j<leng; ++j) {
            let pass = false;
            params.forEach(param => {
                pass |= board[i][j][param];
            });
            if(pass) {
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
        const newCell = {
            ...popedCell,
        };
        params.forEach(param => {
            newCell[param] = false;
        });

        board[cell.y].splice(cell.x, 1, newCell);
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

export const clickPieceThunk = ({ y: cy, x: cx }) => (dispatch, getState) => {
    const {
            canvas: { board, reverseBoard, clicked },
            record: { reversed },
            auth: { tempAuth },
    } = getState();
    
    let reversal = false;
    if(tempAuth) {
        if((tempAuth.role === 'white' && reversed) || (tempAuth.role === 'black' && !reversed)) {
            reversal = true;
        }
    }
    
    let y = cy;
    let x = cx;
    if(reversal) {
        y = 7 - cy;
        x = 7 - cx;
    };

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
    
    let coveredAxis = checkCovered(board, y, x);
    const clearBoard = genClearBoard([...board], [
        'covered',
        'clicked',
    ]);

    coveredAxis.forEach(axis => {
        clearBoard[axis.dy] = [ ...clearBoard[axis.dy] ];
        const popedCell = clearBoard[axis.dy][axis.dx];
        clearBoard[axis.dy].splice(axis.dx, 1, {
            ...popedCell,
            covered:true,
        });
    });

    clearBoard[y] = [ ...clearBoard[y] ];
    clearBoard[y][x] = {
        ...clearBoard[y][x],
        clicked: true,
    }

    const nextReverseBoard = updateReverseBoard(reverseBoard, clearBoard);

    dispatch(changeValue({
        board: clearBoard,
        reverseBoard: nextReverseBoard,
        clicked: { y, x }
    }));
};


const reverseBoard = _.cloneDeep(board);
reverseBoard.reverse();
reverseBoard.forEach(row => {
    row.reverse();
});

const initialState = {
    socket: null,
    error: null,
    board,
    reverseBoard,
    clicked: null,
    blocked: true,
    reversed: false,
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { board } }) => ({
        ...state,
        board,
        reverseBoard: updateReverseBoard(state.reverseBoard, board),
    }),
    [CHANGE_VALUE]: (state, { payload : { board, reverseBoard, clicked } }) => ({
        ...state,
        board,
        reverseBoard,
        clicked,
    }),
    [CLEAR_VALUE]: state => initialState,
    [INITIALIZE_BLOCKED]: (state, { payload: { blocked } }) => ({
        ...state,
        blocked,
    }),
    [CHANGE_BLOCKED]: (state, { payload: { blocked } }) => ({
        ...state,
        blocked,
    }),
    [SET_MOVE_PIECE_SUCCESS]: state => state,
    [SET_MOVE_PIECE_FAILURE]: state => state,
}, initialState);