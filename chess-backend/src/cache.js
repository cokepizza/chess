import User from './models/user';
import Game from './models/game';
import board from './lib/base/board';
import _ from 'lodash';

//  decending order
export const compare = (a, b) => {
    if(a.elo === b.elo) {
        if(a.ratio === b.ratio) {
            if(a.win === b.win) {
                return b.createdAt.getTime() - a.createdAt.getTime();
            } else {
                return b.win - a.win;
            }
        } else {
            return b.ratio - a.ratio;
        }
    } else {
        return b.elo - a.elo;
    }
}

export const getRatio = user => ({ 
    ...user,
    ratio: (user.win === 0
        ? 0
        : ((user.win + user.lose === 0)
                ? 100
                : user.win / (user.win + user.lose)
            )
    ).toFixed(2)
});

const nextBoard = (game, move) => {
    const board = game.board;
    const { prev, next } = move;

    //  set server board object
    const prevPiece = { ...board[prev.y][prev.x] };
    const nextPiece = { ...board[next.y][next.x] };
    board[prev.y][prev.x] = {
        covered: false
    };
    board[next.y][next.x] = {
        ...prevPiece,
        dirty: true,
    };

    //  promotion
    const { owner, piece } = board[next.y][next.x];
    if((owner === 'white' && piece === 'pawn' && next.y === 0) || (owner === 'black' && piece === 'pawn' && next.y === 7)) {
        board[next.y][next.x] = {
            ...board[next.y][next.x],
            piece: 'queen',
        }
    };

    //  castling
    if(board[next.y][next.x].piece === 'king') {
        if(next.x - prev.x === 2) {
            const pieceStore = { ...board[prev.y][prev.x+3] };
            board[prev.y][prev.x+3] = {
                covered: false
            };
            board[prev.y][prev.x+1] = {
                ...pieceStore,
                dirty: true,
            };
        }

        if(next.x - prev.x === -2) {
            const pieceStore = { ...board[prev.y][prev.x-4] };
            board[prev.y][prev.x-4] = {
                covered: false
            };
            board[prev.y][prev.x-1] = {
                ...pieceStore,
                dirty: true,
            };
        }
    }
};

const pieceMoveReduce = game => {
    clearTimeout(game.setTimeout);
    game.setTimeout = setTimeout(() => {
        if(game.index < game.turn) {
            const pieceMove = JSON.parse(game.pieceMove);
            nextBoard(game, pieceMove[game.index]);
            game.participant.forEach(socket => {    
                socket.emit('message', {
                    type: 'change',
                    roomKey: game.roomKey,
                    move: pieceMove[game.index],
                });
            });

            ++game.index;
            pieceMoveReduce(game);
        } else {
            game.index = 0;
            game.board = _.cloneDeep(board);
            
            const inform = game.player.map(player => ({
                username: player.username,
                elo: player.elo,
            }));
            
            game.participant.forEach(socket => {
                socket.emit('message', {
                    type: 'initialize',
                    roomKey: game.roomKey,
                    inform,
                    board: game.board,
                });
            });

            pieceMoveReduce(game);
        }
    }, 500);
};

const cache = async () => {
    const users = await User.find();
    const sortedUsers = users 
        .map(user => user.serialize())
        .map(getRatio)
        .sort(compare);
    
    // const games = await Game.find({}).sort({ 'destroyAt': -1 }).limit(4);
    // const games = await Game.find().sort({ turn: -1, destroyAt: -1 }).limit(4);
    const games = await Game
        .find()
        .sort({ turn: -1, destroyAt: -1 })
        .limit(4)
        .populate('player');

    let billBoard = [];
    if(games) {
        billBoard = games.map((game, roomKey) => ({
            ...game.serialize(),
            index: 0,
            roomKey,
            board: _.cloneDeep(board),
            setTimeout: null,
            participant: [],
        }));
    
        billBoard.forEach((game, index) => {
            setTimeout(() => {
                pieceMoveReduce(game);
            }, 300 * index);
        });
    }

    const data = {
        ranking: {
            limit: 15,
            list: sortedUsers,
        },
        billBoard,
    }    
    
    return data;
};

export default cache;