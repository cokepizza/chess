import _ from 'lodash';

import rules from './rules';
import { genBoard } from './genBoard';

export const findKingLocation = (player, board) => {
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(board[i][j].owner === player && board[i][j].piece === 'king') {
                return {
                    y: i,
                    x: j,
                };
            };
        }
    }
}

export const deduplicate = axisArr => {
    if(axisArr.length === 0) return axisArr;

    const axisSet = new Set();
    axisArr.forEach(axis => axisSet.add(axis.dy * 10 + axis.dx));
    return [ ...axisSet ].map(key => ({ dy: parseInt(key / 10), dx: key % 10 }));
}

export const checkPlayersEveryMove = (player, board, castling) => {
    let coveredAxisBundle = [];
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(board[i][j].owner === player) {
                const coveredAxis = checkCovered(board, i, j, castling);
                coveredAxisBundle = [ ...coveredAxisBundle, ...coveredAxis ];
            }
        }
    };
    
    return deduplicate(coveredAxisBundle);
};

export const checkSafeMove = (player, board) => {
    const enemy = player === 'white' ? 'black' : 'white';
    const clonedBoard = _.cloneDeep(board);

    const playerKing = findKingLocation(player, clonedBoard);
    const coveredAxisBundle = checkPlayersEveryMove(enemy, clonedBoard);

    coveredAxisBundle.forEach(axis => {
        clonedBoard[axis.dy][axis.dx] = {
            ...clonedBoard[axis.dy][axis.dx],
            movable: true,
        }
    });

    //  is king in danger?
    if(clonedBoard[playerKing.y][playerKing.x].movable) {
        return false;
    }

    return true;
};

export const checkMovable = (player, board) => {
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(board[i][j].owner === player) {
                const coveredAxis = checkCovered(board, i, j);
                const length = coveredAxis.length;
                for(let k=0; k<length; ++k) {
                    const tempBoard = genBoard(board, { y: i, x: j }, { y: coveredAxis[k].dy, x: coveredAxis[k].dx });
                    if(checkSafeMove(player, tempBoard)) {
                        return true;
                    };
                }
            }
        }
    };

    return false;
}

export const checkCovered = (board, y, x, castling) => {
    const { piece, owner } = board[y][x];
    let inform = { board, y, x, owner };
    if(!piece) return;

    const { type, move }= rules[piece];
    let coveredAxis = [];

    if(type === 'onetime') {
        coveredAxis = move.reduce((acc, cur) => {
            const dy = y + (owner === 'black' ? -cur.dy: +cur.dy);
            const dx = x + cur.dx;
            if(dy < 0 || dx < 0 || dy > 7 || dx > 7) return acc;
            
            inform = { ...inform, dy, dx };
            
            if(!cur.except || (!(piece === 'king' && castling) && cur.except && cur.except(inform))) {
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
    
    return deduplicate(coveredAxis);
};