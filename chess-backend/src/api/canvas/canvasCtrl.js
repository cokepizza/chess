import _ from 'lodash';

import { checkSafeMove, checkMovable, checkCovered } from '../../lib/base/validation';
import { genBoard } from '../../lib/base/genBoard';
import instanceSanitizer from '../../lib/util/instanceSanitizer';

export const movePiece = (req, res) => {
    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);
    
    const { socket: socketId, move } = req.body;

    const io = req.app.get('io');
    const gameMap = req.app.get('game');
    const canvasMap = req.app.get('canvas');
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const auth = req.user ? true : false;

    const { prev, next } = move;

    //  defensive code
    if(!gameMap.has(key)) {
        console.dir(`There's no available Game #${key}`);
        return res.status(403).send({ error: `There's no available Game #${key}` });
    }

    const game = gameMap.get(key);
    if(!game._participant.has(req.sessionID)) {
        console.dir(`Not Authorized`);
        return res.status(403).send({ error: `Not Authorized` });
    }
    console.dir(game);

    //  check if the game is ready to running
    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    //  check if the game meets the requirements
    if(!game._black || !game._white) {
        console.dir(`The game has not yet met the requirements`);
        return res.status(403).send({ error: `The game has not yet met the requirements` });
    }

    //  check if it's a player
    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    console.dir(`player: ${player} (${req.sessionID})`);
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        return res.status(403).send({ error: `You're just a spectator` });
    }

    //  check if player needs authentication
    console.dir(`player ${player}'s Authenication : ${game[`_${player}Auth`]}`);
    console.dir(`request Authenication : ${auth}`);
    if(game[`_${player}Auth`] && !auth || !game[`_${player}Auth`] && auth) {
        console.dir(`Authentication mismatch`);
        return res.status(403).send({ error: `Authentication mismatch` });
    }

    //  check if player authentication confirms
    if(auth && req.user.username !== game[player]) {
        console.dir(`Authentication failed`);
        return res.status(403).send({ error: `Authentication failed` });
    }
    
    //  check if it's your turn
    if((game.turn % 2 === 0 && player !== 'white') || (game.turn % 2 === 1 && player !== 'black')) {
        console.dir(`It's not your turn`);
        return res.status(403).send({ error: `It's not your turn` });
    }

    //  check if piece is player's
    const board = canvasMap.get(key);
    if(board[prev.y][prev.x].owner !== player) {
        console.dir(`It's not your piece`);
        return res.status(403).send({ error: `It's not your piece` });
    }

    //  check covered move or not (for irregular user)
    const coveredAxis = checkCovered(board, prev.y, prev.x);
    const length = coveredAxis.length;
    let covered = false;
    for(let i=0; i<length; ++i) {
        if(coveredAxis[i].dy === next.y && coveredAxis[i].dx === next.x) {
            covered = true;
            break;
        }
    }

    if(!covered) {
        console.dir(`This move is not covered`);
        return res.status(403).send({ error: `This move is not covered` });
    }

    //  generate temporary board for check validation
    const tempBoard = genBoard(board, prev, next);

    //  validate my choice
    if(!checkSafeMove(player, tempBoard)) {
        
        io.of('/chat').to(key).emit('message', {
            type: 'change',
            message: `This move is not possible`,
        });

        console.dir(`validate my safe fail`);
        return res.status(403).send({ error: `validate my safe fail` });
    };


    // console.dir(req.session);

    // const gameObj = gameMap.get(key);
    // gameObj._winner = gameObj.white;
    // gameObj._loser = gameObj.white;
    // // gameObj._loser = gameObj.black;
    // gameObj._destroy();
    // return res.status(403).send('test now');
    
    let endGame = false;
    let snapshot = {};

    //  validate enemy's state
    const enemy = player === 'white' ? 'black' : 'white';
    if(!checkSafeMove(enemy, tempBoard)) {
        if(checkMovable(enemy, tempBoard)) {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `${enemy} Checked`,
            });
        } else {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `CheckMate ${player} win`,
            });

            endGame = true;
            snapshot = {
                draw: false,
                winner: game[player],
                loser: game[enemy],
            }
        }
    } else {
        if (!checkMovable(enemy, tempBoard)) {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `StaleMate. The game is draw`,
            });

            endGame = true;
            snapshot = {
                draw: true,
            }
        }
    }

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

    //  set server game object
    game.turn = game.turn + 1;
    game.order = game.turn % 2 === 0 ? 'white' : 'black';
    const record = req.app.get('record').get(key);
    record.pieceMove.push({
        prevPiece,
        nextPiece,
        ...move
    });
    record._change();
    
    console.dir('complete');
    
    //  broadcast canvas change to everyone in the game
    io.of('/canvas').to(key).emit('message', {
        type: 'change',
        move
    });

    io.of('/game').to(key).emit('message', {
        type: 'initialize',
        ...instanceSanitizer(game),
    });

    if(endGame) {
        game._destroy(snapshot);
    }
    
    return res.status(200).end();
};