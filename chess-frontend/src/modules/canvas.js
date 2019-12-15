import { createAction, handleActions } from 'redux-actions';
import createRequestThunk from '../lib/createRequestThunk';
import * as gameCtrl from '../lib/api/game';
import rules from '../lib/base/rules';
import board from '../lib/base/board'

/*
    move: [[], [], [], [] ...]
    => [y, x]
*/

const SET_BOARD = 'canvas/SET_BOARD';
const SET_MOVE_PIECE = 'game/SET_MOVE_PIECE';

export const setBoard = createAction(SET_BOARD, payload => payload);
export const setMovePieceThunk = createRequestThunk(SET_MOVE_PIECE, gameCtrl.movePiece);
export const setBoardThunk = ({ move }) => ( dispatch, getState ) => {
    const { prev, next } = move;
    const { canvas: { board } } = getState();
    const cell = board[prev.y][prev.x];
    const clearBoard = genClearBoard(board);
    clearBoard[next.y][next.x] = {
        ...cell,
    }
    clearBoard[prev.y][prev.x] = { covered: false };
    dispatch(setBoard({ board: clearBoard, clicked: null }));
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

    dispatch(setBoard({ board: clearBoard, clicked: { y, x } }));
};

const initialState = {
    moved: null,
    error: null,
    clicked: null,
    board,
};



export default handleActions({
    [SET_BOARD]: (state, { payload : { board, clicked } }) => ({
        ...state,
        board,
        clicked,
    }),
}, initialState);