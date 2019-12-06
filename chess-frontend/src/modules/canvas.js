import { createAction, handleActions } from 'redux-actions';
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
                eatable: false,
            },
            {
                dy: -2,
                dx: 0,
                eatable: false,
                except: {

                }
            },
            {
                dy: -1,
                dx: -1,
                eatable: true,
            },
            {
                dy: -1,
                dx: 1,
                eatable: true,
            }
        ],
    },
    
};

const SET_BOARD = 'canvas/SET_BOARD';
export const setBoard = createAction(SET_BOARD, payload => payload);

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
        
        dispatch(setBoard({ board: clearBoard, clicked: null }));
        return;
    }

    const { piece, owner } = board[y][x];
    if(!piece) return;

    const { type, move }= rules[piece];
    let coveredAxis = [];
    if(type === 'onetime') {
        coveredAxis = move.reduce((acc, cur) => {
            const dy = y + cur.dy;
            const dx = x + cur.dx;
            if(dy >= 0 && dx >= 0 && dy < 8 && dx < 8) {
                if((cur.eatable && board[dy][dx].piece) || (!cur.eatable && !board[dy][dx].piece)) {
                    if(!board[dy][dx].owner || board[y][x].owner !== board[dy][dx].owner) {
                        acc.push({dy, dx});
                    }
                }
            }
            return acc;
        }, []);
    } else {

    }

    const clearBoard = genClearBoard(board);

    coveredAxis.forEach(axis => {
        clearBoard[axis.dy][axis.dx].covered = true;
    });

    dispatch(setBoard({ board: clearBoard, clicked: { y, x } }));
};

const initialState = {
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


