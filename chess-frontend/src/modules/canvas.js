import { createAction, handleActions } from 'redux-actions';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';
import _ from 'lodash';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import { connectNamespace } from '../lib/websocket/websocket';
import * as canvasCtrl from '../lib/api/canvas';

// import rules from '../lib/base/rules';
import board from '../lib/base/board';
import { checkCovered, checkSafeMove } from '../lib/base/validation';
import { genBoard, genClearBoard, genReplayBoard } from '../lib/base/genBoard';
import { setShowIndex } from './record';

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
            
            // console.dir(nextPiece);
            // console.dir(prevPiece);
    
            Object.keys(nextPiece).every(key => {
                // console.dir(key);
                if(!prevPiece[key] || prevPiece[key] !== nextPiece[key]) {
                    // console.dir(prevPiece[key]);
                    // console.dir(nextPiece[key]);
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

export const clearClickedThunk = () => (dispatch, getState) => {
    const { canvas: { board, reverseBoard } } = getState();
    const clearBoard = genClearBoard([...board], [
        'covered',
        'clicked',
    ]);

    const nextReverseBoard = updateReverseBoard(reverseBoard, clearBoard);
    
    dispatch(changeValue({
        board: clearBoard,
        reverseBoard: nextReverseBoard,
        clicked: null
    }));
}

export const replayValueThunk = ({ diff, index }) => ( dispatch, getState ) => {
    const {
        canvas: { board, reverseBoard },
        record: { showIndex, pieceMove },
        socketAuth: { role },
        game: { turn }
    } = getState();

    if(!diff) {
        diff = index - showIndex;
    }

    if(diff === 0) return;
    if(showIndex+diff < -1 || showIndex+diff >= pieceMove.length) return;

    const nextBoard = genReplayBoard(board, pieceMove, showIndex, showIndex+diff);
    const nextReverseBoard = updateReverseBoard(reverseBoard, nextBoard);

    if(showIndex+diff+1 === pieceMove.length) {
        if(((role === 'white' || role === 'spectator') && turn % 2 === 0) || (role === 'black' && turn % 2 === 1)) {
            dispatch(changeBlocked({ blocked: false }));
        } else {
            dispatch(changeBlocked({ blocked: true }));
        };
        dispatch(setShowIndex({
            showIndex: showIndex+diff,
            replayMode: false,
        }));
    } else {
        dispatch(changeBlocked({ blocked: true }));
        dispatch(setShowIndex({
            showIndex: showIndex+diff,
            replayMode: true,
        }));
    }
    dispatch(changeValue({
        board: nextBoard,
        reverseBoard: nextReverseBoard,
        clicked: null
    }));
    
};

export const changeValueThunk = ({ move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { canvas: { board, reverseBoard },
            record: { showIndex, replayMode },
            // socketAuth: { role },
            // game: { turn }
        } = getState();

    if(replayMode) return;
    
    // if(((role === 'white' || role === 'spectator') && turn % 2 === 0) || (role === 'black' && turn % 2 === 1)) {
    //     dispatch(changeBlocked({ blocked: false }));
    // } else {
    //     dispatch(changeBlocked({ blocked: true }));
    // };

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
    dispatch(setShowIndex({ showIndex: showIndex+1 }));
}

function* connectWebsocketSaga (action) {
    const query = action.payload;
    
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
        socketAuth: { role },
    } = getState();
    
    let reversal = false;
    if((role === 'white' && reversed) || (role === 'black' && !reversed)) {
        reversal = true;
    }
    
    let y = cy;
    let x = cx;
    if(reversal) {
        y = 7 - cy;
        x = 7 - cx;
    };

    //  Prevents the player from seeing enemy's piece movements
    if(!clicked && board[y][x].owner !== role) return;
    if(clicked && !board[y][x].covered && board[y][x].owner !== role) return;

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
        const tempBoard = genBoard(clearBoard, { y, x }, { y: axis.dy, x: axis.dx });
        if(!checkSafeMove(board[y][x].owner, tempBoard)) {
            return;
        };

        clearBoard[axis.dy] = [ ...clearBoard[axis.dy] ];
        const popedCell = clearBoard[axis.dy][axis.dx];
        clearBoard[axis.dy].splice(axis.dx, 1, {
            ...popedCell,
            covered: true,
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