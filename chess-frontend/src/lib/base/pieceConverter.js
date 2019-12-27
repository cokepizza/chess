import { GiChessPawn, GiChessKing, GiChessQueen,
    GiChessBishop, GiChessKnight, GiChessRook, GiPlainCircle } from 'react-icons/gi';

export const pieceMapper = {
    'pawn': GiChessPawn,
    'king': GiChessKing,
    'queen': GiChessQueen,
    'bishop': GiChessBishop,
    'knight': GiChessKnight,
    'rook': GiChessRook,
    'covered': GiPlainCircle,
}

export const playerMapper = {
    'white': {
        color: 'white',
        style: {
            filter: `drop-shadow(1px 1px 1px white)`,
            width: '80%',
            height: '80%',
        }
    },
    'black': {
        color: 'black',
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '80%',
            height: '80%',
        }
    },
    'covered0': {
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '30%',
            height: '30%',
            color: 'rgb(130, 151, 105)',
            
        }
    },
    'covered1': {
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '30%',
            height: '30%',
            color: 'rgb(100, 111, 64)',
        }
    }
}