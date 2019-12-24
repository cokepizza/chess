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

    //  set server board object
    //  참조값 변경에 유의해야함 roomMap.set 참고할 것
    const copied = { ...board[prev.y][prev.x]};
    board[prev.y][prev.x] = {
        covered: false
    };
    board[next.y][next.x] = copied;

    //  set server room object
    roomMap.set(key, {
        ...room,
        turn: room.turn + 1,
    });

    const newRoom = roomMap.get(key);
    console.dir('complete');
    
    //  broadcast canvas change to everyone in the room
    io.of('/canvas').to(key).emit('message', {
        type: 'change',
        move
    });

    io.of('/game').to(key).emit('message', {
        type: 'initialize',
        status: newRoom,
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