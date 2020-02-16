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
})

const pieceMoveReduce = game => {
    clearTimeout(game.setTimeout);
    game.setTimeout = setTimeout(() => {
        if(game.index < game.turn) {
                game.participant.forEach(socket => {
                    const pieceMove = JSON.parse(game.pieceMove);
                    socket.emit('message', {
                        type: 'change',
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
        billBoard = games.map(game => ({
            ...game.serialize(),
            index: 0,
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