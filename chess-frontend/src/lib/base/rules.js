import { checkPlayersEveryMove } from './validation';

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
                    if((owner === 'black' && board[3][x].piece) || (owner === 'white' && board[4][x].piece)) return false;
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
            {
                dy: 0,
                dx: 2,
                except: function(props) {
                    const { board, y, x, owner } = props;
                    const enemy = (owner === 'white') ? 'black' : 'white';

                    //  king dirty check
                    if(!board[y][x].piece || board[y][x].dirty) {
                        return false;
                    }

                    //  rook dirty check
                    if(!board[y][x+3].piece || board[y][x+3].dirty) {
                        return false;
                    }

                    //  check path is empty
                    if(board[y][x+1].piece || board[y][x+2].piece) {
                        return false;
                    }

                    //  is king & path safe?, prevent castling loop by flag
                    const coveredAxisBundle = checkPlayersEveryMove(enemy, board, true);
                    const length = coveredAxisBundle.length;
                    for(let i=0; i<length; ++i) {
                        const axis = coveredAxisBundle[i];
                        if(axis.dy === y && (axis.dx === x || axis.dx === x+1 || axis.dx === x+2)) {
                            return false;
                        }
                    }


                    return true;
                },             
            },
            {
                dy: 0,
                dx: -2,
                except: function(props) {
                    const { board, y, x, owner } = props;
                    const enemy = (owner === 'white') ? 'black' : 'white';
                    
                    //  king dirty check
                    if(!board[y][x].piece || board[y][x].dirty) {
                        return false;
                    }

                    //  rook dirty check
                    if(!board[y][x-4].piece || board[y][x-4].dirty) {
                        return false;
                    }

                    //  check path is empty
                    if(board[y][x-1].piece || board[y][x-2].piece || board[y][x-3].piece ) {
                        return false;
                    }

                    //  is king & path safe?, prevent castling loop by flag
                    const coveredAxisBundle = checkPlayersEveryMove(enemy, board, true);
                    const length = coveredAxisBundle.length;
                    for(let i=0; i<length; ++i) {
                        const axis = coveredAxisBundle[i];
                        if(axis.dy === y && (axis.dx === x || axis.dx === x-1 || axis.dx === x-2)) {
                            return false;
                        }
                    }

                    return true;
                },             
            }
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

export default rules;