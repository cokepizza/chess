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

const pieceMoveReduce = board => {
    clearTimeout(board.setTimeout);
    if(board.index <= board.turn) {
        board.setTimeout = setTimeout(() => {
            console.dir(`next tick ${board.index}`);
            console.dir(board.participant);
            board.participant.forEach(socket => {
                socket.emit('message', {
                    type: 'change',
                    move: board.pieceMove[board.index],
                });
            });

            ++board.index;
            pieceMoveReduce(board);
        }, 3000);
    } else {
        board.index = 0;
        board.board = _.cloneDeep(board);

        board.participant.forEach(socket => {
            socket.emit('message', {
                type: 'initialize',
                board: board.board,
            });
        });

        pieceMoveReduce(board);
    }
};

const cache = async () => {
    const users = await User.find();
    const sortedUsers = users 
        .map(user => user.serialize())
        .map(getRatio)
        .sort(compare);
    
    // const games = await Game.find({}).sort({ 'destroyAt': -1 }).limit(4);
    const games = await Game.find().sort({ turn: -1, destroyAt: -1 }).limit(4);
    const billBoard = games.map(game => (
        {
            ...game.serialize(),
            index: 0,
            board: _.cloneDeep(board),
            setTimeout: null,
            participant: [],
        }));

    billBoard.forEach(board => {
        pieceMoveReduce(board);
    });

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