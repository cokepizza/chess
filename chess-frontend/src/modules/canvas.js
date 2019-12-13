import { createAction, handleActions } from 'redux-actions';
import createRequestThunk from '../lib/createRequestThunk';
import * as gameCtrl from '../lib/api/game';
/*
    move: [[], [], [], [] ...]
    => [y, x]
*/

const rules = {
    pawn: {
        type: 'onetime',
        move: [
            {
                dy: -1,
                dx: 0,
                except: function(props) {
                    const { board, dy, dx } = props;
                    if(board[dy][dx].piece) {
                        return false;
                    }
                    return true;
                }
            },
            {
                dy: -2,
                dx: 0,
                except: function(props) {
                    const { board, y, x, owner } = props;
                    if((owner === 'black' && y !== 1) || (owner === 'white' && y !== 6)) return false;
                    if((owner === 'black' && board[2][x].piece) || (owner === 'white' && board[5][x].piece)) return false;
                    return true;
                }
            },
            {
                dy: -1,
                dx: -1,
                except: function(props) {
                    const { board, dy, dx } = props;
                    if(board[dy][dx].piece) {
                        return true;
                    }
                    return false;
                }
            },
            {
                dy: -1,
                dx: 1,
                except: function(props) {
                    const { board, dy, dx } = props;
                    if(board[dy][dx].piece) {
                        return true;
                    }
                    return false;
                }
            }
        ],
    },
    knight: {
        type: 'onetime',
        move: [
            {
                dy: -2,
                dx: -1,
            },
            {
                dy: -2,
                dx: 1,
            },
            {
                dy: 2,
                dx: -1,
            },
            {
                dy: 2,
                dx: 1,
            },
            {
                dy: -1,
                dx: -2,
            },
            {
                dy: -1,
                dx: 2,
            },
            {
                dy: 1,
                dx: -2,
            },
            {
                dy: 1,
                dx: 2,
            },
        ]
    },
    king: {
        type: 'onetime',
        move: [
            {
                dy: 1,
                dx: 0
            },
            {
                dy: -1,
                dx: 0
            },
            {
                dy: 0,
                dx: 1
            },
            {
                dy: 0,
                dx: -1
            },
            {
                dy: -1,
                dx: 1
            },
            {
                dy: -1,
                dx: -1
            },
            {
                dy: 1,
                dx: -1
            },
            {
                dy: 1,
                dx: 1
            },
        ]
    },
    bishop: {
        type: 'multitime',
        move: [
            {
                dy: 1,
                dx: -1
            },
            {
                dy: 1,
                dx: 1
            },
            {
                dy: -1,
                dx: -1
            },
            {
                dy: -1,
                dx: 1
            },
        ]
    },
    rook: {
        type: 'multitime',
        move: [
            {
                dy: 1,
                dx: 0
            },
            {
                dy: -1,
                dx: 0
            },
            {
                dy: 0,
                dx: -1,
            },
            {
                dy: 0,
                dx: 1
            },
        ]
    },
    queen: {
        type: 'multitime',
        move: [
            {
                dy: 1,
                dx: -1
            },
            {
                dy: 1,
                dx: 1
            },
            {
                dy: -1,
                dx: -1
            },
            {
                dy: -1,
                dx: 1
            },
            {
                dy: 1,
                dx: 0
            },
            {
                dy: -1,
                dx: 0
            },
            {
                dy: 0,
                dx: -1,
            },
            {
                dy: 0,
                dx: 1
            },
        ]
    }
};

const SET_BOARD = 'canvas/SET_BOARD';
const SET_MOVE_PIECE = 'game/SET_MOVE_PIECE';

export const setBoard = createAction(SET_BOARD, payload => payload);
export const setMovePiece = createRequestThunk(SET_MOVE_PIECE, gameCtrl.movePiece);

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
        const cell = board[clicked.y][clicked.x];
        const clearBoard = genClearBoard(board);
        clearBoard[y][x] = {
            ...cell,
        }
        clearBoard[clicked.y][clicked.x] = { covered: false };
        
        console.dir(clicked);
        console.dir(y);
        console.dir(x);
        
        // (async () => {
        //     dispatch(setMovePiece({ 
        //         move: {
        //             prev: clicked,
        //             next: 
        //             piece: 
        //         }
        //      }));
        // })();
        
         dispatch(setBoard({ board: clearBoard, clicked: null }));
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
    board: [
        [
            {
                piece: 'rook',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'knight',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'bishop',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'king',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'queen',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'bishop',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'knight',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'rook',
                owner: 'black',
                covered: false,
            }
        ],
        [
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'black',
                covered: false,
            }
        ],
        [ {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false} ],
        [ {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false} ],
        [ {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false} ],
        [ {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false}, {covered: false} ],
        [
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'pawn',
                owner: 'white',
                covered: false,
            }
        ],
        [
            {
                piece: 'rook',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'knight',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'bishop',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'queen',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'king',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'bishop',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'knight',
                owner: 'white',
                covered: false,
            },
            {
                piece: 'rook',
                owner: 'white',
                covered: false,
            }
        ]
    ]
};



export default handleActions({
    [SET_BOARD]: (state, { payload : { board, clicked } }) => ({
        ...state,
        board,
        clicked,
    }),
}, initialState);


