import { checkSafeMove, checkCheckmate, checkCovered } from '../../lib/base/validation';
import _ from 'lodash';

export const movePiece = (req, res) => {
    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);
    
    const { socket: socketId, move } = req.body;

    const io = req.app.get('io');
    const roomMap = req.app.get('room');
    const canvasMap = req.app.get('canvas');
    const socketToRoomMap = req.app.get('socketToRoom');
    const key = socketToRoomMap.get(socketId);

    const { prev, next } = move;

    console.dir(req.session);
    
    //  defensive code
    if(!roomMap.has(key)) {
        console.dir(`There's no available Room #${key}`);
        res.send({ error: `There's no available Room #${key}` });
        return res.status(403).end();
    }

    const room = roomMap.get(key);
    if(!room._participant.has(req.sessionID)) {
        console.dir(`Not Authorized`);
        res.send({ error: `Not Authorized` });
        return res.status(403).end();
    }
    console.dir(room);

    //  check if the room is ready to start
    if(!room._black || !room._white) {
        console.dir(`The room is not yet ready to start`);
        res.send({ error: `The room is not yet ready to start` });
        return res.status(403).end();
    }

    //  check if it's a player
    const player = room._black === req.sessionID ? 'black': (room._white === req.sessionID ? 'white' : 'spectator');
    console.dir(`player: ${player} (${req.sessionID})`);
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        res.send({ error: `You're just a spectator` });
        return res.status(403).end();
    }
    
    //  check if it's your turn
    if((room.turn % 2 === 0 && player !== 'white') || (room.turn % 2 === 1 && player !== 'black')) {
        console.dir(`It's not your turn`);
        res.send({ error: `It's not your turn` });
        return res.status(403).end();
    }

    //  check if piece is player's
    const board = canvasMap.get(key);
    if(board[prev.y][prev.x].owner !== player) {
        console.dir(`It's not your piece`);
        res.send({ error: `It's not your piece` });
        return res.status(403).end();
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
        res.send({ error: `This move is not covered` });
        return res.status(403).end();
    }

    //  temporary move for check validation
    const tempBoard = _.cloneDeep(board);
    
    const pieceStore = { ...tempBoard[prev.y][prev.x] };
    tempBoard[prev.y][prev.x] = {
        covered: false
    };
    tempBoard[next.y][next.x] = pieceStore;

    //  temporary promotion (pawn => queen)
    const { owner: tempOwner, piece: tempPiece } = tempBoard[next.y][next.x];
    if((tempOwner === 'white' && tempPiece === 'pawn' && next.y === 0) || (tempOwner === 'black' && tempPiece === 'pawn' && next.y === 7)) {
        tempBoard[next.y][next.x] = {
            ...tempBoard[next.y][next.x],
            piece: 'queen',
        }
    };

    //  validate my choice
    if(!checkSafeMove(player, tempBoard)) {
        console.dir(`validate my safe fail`);
        res.send({ error: `validate my safe fail` });
        
        io.of('/chat').to(key).emit('message', {
            type: 'change',
            message: `This move is not possible`,
        });
        return res.status(403).end();
    };

    //  validate enemy's state
    const enemy = player === 'white' ? 'black' : 'white';
    if(!checkSafeMove(enemy, tempBoard)) {
        if(checkCheckmate(enemy, tempBoard)) {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `CheckMate ${player} win`,
            });
        } else {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `${enemy} Checked`,
            });
        }
    }

    //  set server board object
    const prevPiece = { ...board[prev.y][prev.x] };
    const nextPiece = { ...board[next.y][next.x] };
    board[prev.y][prev.x] = {
        covered: false
    };
    board[next.y][next.x] = prevPiece;

    const { owner, piece } = board[next.y][next.x];
    if((owner === 'white' && piece === 'pawn' && next.y === 0) || (owner === 'black' && piece === 'pawn' && next.y === 7)) {
        board[next.y][next.x] = {
            ...board[next.y][next.x],
            piece: 'queen',
        }
    };

    //  set server room object
    room.turn = room.turn + 1;
    room.order = room.turn % 2 === 0 ? 'white' : 'black';
    const record = req.app.get('record').get(key);
    record.pieceMove.push({
        prevPiece,
        nextPiece,
        ...move
    });
    record._change();
    
    console.dir('complete');
    
    //  broadcast canvas change to everyone in the room
    io.of('/canvas').to(key).emit('message', {
        type: 'change',
        move
    });

    io.of('/game').to(key).emit('message', {
        type: 'initialize',
        ...room,
    })
    
    return res.status(200).end();
};




//  test code
// export const movePiece = (req, res) => {
//     console.dir('----------http(movePiece)---------')
//     console.dir(req.sessionID);
    
//     const { socket: socketId, move } = req.body;

//     const io = req.app.get('io');
//     const roomMap = req.app.get('room');
//     const canvasMap = req.app.get('canvas');
//     const socketToRoomMap = req.app.get('socketToRoom');
//     const key = socketToRoomMap.get(socketId);

//     const { prev, next } = move;

//     console.dir(req.session);
//     const room = roomMap.get(key);
//     console.dir(room);
//     const player = room._black === req.sessionID ? 'black': (room._white === req.sessionID ? 'white' : 'spectator');
//     console.dir(`player: ${player} (${req.sessionID})`);
//     const board = canvasMap.get(key);

//     const copied = { ...board[prev.y][prev.x]};
//     board[prev.y][prev.x] = {
//         covered: false
//     };
//     board[next.y][next.x] = copied;

//     //  set server room object
//     roomMap.set(key, {
//         ...room,
//         turn: room.turn + 1,
//     });

//     const newRoom = roomMap.get(key);
//     console.dir('complete');
    
//     //  broadcast canvas change to everyone in the room
//     io.of('/canvas').to(key).emit('message', {
//         type: 'change',
//         move,
//         turn: newRoom.turn,
//     });
    
//     return res.status(200).end();
// };