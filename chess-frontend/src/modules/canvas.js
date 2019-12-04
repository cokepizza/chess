import { createAction, handleActions } from 'redux-actions';

const initialState = {
    board: [
        [
            {
                piece: 'rook',
            },
            {
                piece: 'knight',
            },
            {
                piece: 'bishop',
            },
            {
                piece: 'king',
            },
            {
                piece: 'queen',
            },
            {
                piece: 'bishop'
            },
            {
                piece: 'knight',
            },
            {
                piece: 'rook',    
            }
        ],
        [
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn'
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',    
            }
        ],
        [ {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {}, {}, {}, {}, {}, {}, {}, {} ],
        [
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn'
            },
            {
                piece: 'pawn',
            },
            {
                piece: 'pawn',    
            }
        ],
        [
            {
                piece: 'rook',
            },
            {
                piece: 'knight',
            },
            {
                piece: 'bishop',
            },
            {
                piece: 'queen',
            },
            {
                piece: 'king',
            },
            {
                piece: 'bishop'
            },
            {
                piece: 'knight',
            },
            {
                piece: 'rook',    
            }
        ]
    ]
};

export default handleActions({

}, initialState);


