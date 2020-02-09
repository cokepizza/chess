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

export const genClearBoard = (board, params) => {
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

export const genReplayBoard = (board, pieceMove, prevIndex, nextIndex) => {
    //  board should be reflect prevIndex pieceMove
    const nextBoard = genClearBoard([...board], [
        'covered',
        'clicked',
        'tracked',
    ]);
    
    if(prevIndex < nextIndex) {
        for(let i=prevIndex+1; i<=nextIndex; ++i) {
            const beforeIndex = pieceMove[i].prev;
            const beforePiece = pieceMove[i].prevPiece;
            const afterIndex = pieceMove[i].next;
            const afterPiece = pieceMove[i].nextPiece;
            nextBoard[beforeIndex.y] = [ ...nextBoard[beforeIndex.y] ];
            nextBoard[beforeIndex.y][beforeIndex.x] = { ...afterPiece };
            nextBoard[afterIndex.y] = [ ...nextBoard[afterIndex.y] ];
            nextBoard[afterIndex.y][afterIndex.x] = { ...beforePiece };
        }
    } else {
        for(let i=prevIndex; i>nextIndex; --i) {
            const beforeIndex = pieceMove[i].next;
            const beforePiece = pieceMove[i].nextPiece;
            const afterIndex = pieceMove[i].prev;
            const afterPiece = pieceMove[i].prevPiece;
            nextBoard[beforeIndex.y] = [ ...nextBoard[beforeIndex.y] ];
            nextBoard[beforeIndex.y][beforeIndex.x] = { ...beforePiece };
            nextBoard[afterIndex.y] = [ ...nextBoard[afterIndex.y] ];
            nextBoard[afterIndex.y][afterIndex.x] = { ...afterPiece };
        }
    }
    if(0 <= nextIndex && nextIndex < pieceMove.length) {
        const {
            prev: { y: prevY, x: prevX },
            next: { y: nextY, x: nextX }
        } = pieceMove[nextIndex];

        nextBoard[prevY] = [ ...nextBoard[prevY] ];
        nextBoard[prevY][prevX] = {
            ...nextBoard[prevY][prevX],
            tracked: true,
        };

        nextBoard[nextY] = [ ...nextBoard[nextY] ];
        nextBoard[nextY][nextX] = {
            ...nextBoard[nextY][nextX],
            tracked: true,
        };
    }

    console.dir(nextBoard);
    return nextBoard;
}