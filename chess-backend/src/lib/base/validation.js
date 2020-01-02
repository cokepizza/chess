import rules from './rules';
import _ from 'lodash';

export const checkSafeMove = (player, board, prev, next) => {
    const enemy = player === 'white' ? 'black' : 'white';

    const afterBoard = _.cloneDeep(board);
    afterBoard[next.y][next.x] = {
        ...afterBoard[prev.y][prev.x],
    };
    afterBoard[prev.y][prev.x] = {
        covered: false,
    };

    //  check king's location
    let playerKing;
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(afterBoard[i][j].owner === player && afterBoard[i][j].piece === 'king') {
                playerKing = {
                    y: i,
                    x: j,
                };
            };
        }
    }

    let coveredAxisBundle = [];
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(afterBoard[i][j].owner === enemy) {
                const coveredAxis = checkCovered(afterBoard, i, j);
                coveredAxisBundle = [ ...coveredAxisBundle, ...coveredAxis ];
            }
        }
    };

    coveredAxisBundle.forEach(axis => {
        afterBoard[axis.dy][axis.dx] = {
            ...afterBoard[axis.dy][axis.dx],
            dirty: true,
        }
    });

    console.dir(coveredAxisBundle);

    //  is king in danger?
    if(afterBoard[playerKing.y][playerKing.x].dirty) {
        return false;
    }

    return true;
};

export const checkCheckmate = (player, board) => {

    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(board[i][j].owner === player) {
                const coveredAxis = checkCovered(board, i, j);
                coveredAxis.forEach(axis => {
                    if(checkSafeMove(player, board, { y: i, x: j }, { y: axis.dy, x: axis.dx })) {
                        return false;
                    };
                })
            }
        }
    };

    return true;
}

export const checkCovered = (board, y, x) => {
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

    return coveredAxis;
};