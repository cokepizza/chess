import rules from './rules';
import _ from 'lodash';

const validation = (board, prev, next) => {
    const player = board[prev.y][prev.x].owner;
    const enemy = player === 'white' ? 'black' : 'white';

    const afterBoard = _.cloneDeep(board);
    afterBoard[next.y][next.x] = {
        ...afterBoard[prev.y][prev.x],
    };
    afterBoard[prev.y][prev.x] = {
        covered: false,
    };

    //  owner validation check

    //  check king's location
    let playerKing;
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(afterBoard[i][j].owner === player && afterBoard[i][j].owner === 'king') {
                playerKing = {
                    y: i,
                    x: j,
                };
            };
        }
    }

    //  dirty check
    const playerKing;
    for(let i=0; i<8; ++i) {
        for(let j=0; j<8; ++j) {
            if(afterBoard[i][j].owner === enemy) {
                const { type, move } = rules[afterBoard[i][j].piece];

                if(type === 'onetime') {
                    const mul = enemy === 'white' ? 1 : -1;
                    move.forEach(cur => {
                        const dy = i + mul * cur.dy;
                        const dx = j + cur.dx;

                        // let inform = { board: afterBoard, i, j, turn, owner };
                        if(!afterBoard[dy][dx].owner || afterBoard[dy][dx].owner && afterBoard[dy][dx].owner === player) {
                            afterBoard[dy][dx] = {
                                ...afterBoard[dy][dx],
                                dirty: true,
                            }
                        }
                    });
                } else {
                    move.forEach(cur => {
                        let counter = 0;
                        while(true) {
                            ++counter;
                            const dy = i + counter * mul * cur.dy
                            const dx = j + counter * cur.dx;
                            
                            if(dy < 0 || dx < 0 || dy > 7 || dx > 7) break;
                            if(board[dy][dx].owner && board[dy][dx].owner === enemy) break;
                            afterBoard[dy][dx] = {
                                ...afterBoard[dy][dx],
                                dirty: true,
                            }
                            if(board[dy][dx].owner && board[dy][dx].owner === player) break;
                        }
                    })
                };
            }
        }
    }

    //  is king in danger?
    if(afterBoard[playerKing.y][playerKing.x].dirty) {
        return false;
    }

    //  opposite validate check (checkmate)


};

export default validation;