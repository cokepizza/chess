import _ from 'lodash';

export const genBoard = (board, prev, next) => {
    const tempBoard = _.cloneDeep(board);
    
    const pieceStore = { ...tempBoard[prev.y][prev.x] };
    tempBoard[prev.y][prev.x] = {
        covered: false
    };
    tempBoard[next.y][next.x] = {
        ...pieceStore,
        dirty: true,
    };

    //  promotion (pawn => queen)
    const { owner, piece } = tempBoard[next.y][next.x];
    if((owner === 'white' && piece === 'pawn' && next.y === 0) || (owner === 'black' && piece === 'pawn' && next.y === 7)) {
        tempBoard[next.y][next.x] = {
            ...tempBoard[next.y][next.x],
            piece: 'queen',
        }
    };

    //  castling
    if(tempBoard[next.y][next.x].piece === 'king') {
        if(next.x - prev.x === 2) {
            const pieceStore = { ...tempBoard[prev.y][prev.x+3] };
            tempBoard[prev.y][prev.x+3] = {
                covered: false
            };
            tempBoard[prev.y][prev.x+1] = {
                ...pieceStore,
                dirty: true,
            };
        }

        if(next.x - prev.x === -2) {
            const pieceStore = { ...tempBoard[prev.y][prev.x-4] };
            tempBoard[prev.y][prev.x-4] = {
                covered: false
            };
            tempBoard[prev.y][prev.x-1] = {
                ...pieceStore,
                dirty: true,
            };
        }
    }
    
    return tempBoard;
};