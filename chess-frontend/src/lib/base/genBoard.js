import _ from 'lodash'

export const genBoard = (board, prev, next) => {
    const tempBoard = _.cloneDeep(board);
    
    const pieceStore = { ...tempBoard[prev.y][prev.x] };
    tempBoard[prev.y][prev.x] = {
        covered: false
    };
    tempBoard[next.y][next.x] = pieceStore;

    //  promotion (pawn => queen)
    const { owner, piece } = tempBoard[next.y][next.x];
    if((owner === 'white' && piece === 'pawn' && next.y === 0) || (owner === 'black' && piece === 'pawn' && next.y === 7)) {
        tempBoard[next.y][next.x] = {
            ...tempBoard[next.y][next.x],
            piece: 'queen',
        }
    };

    return tempBoard;
};