export const movePiece = (req, res) => {
    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);
    
    // canvas.in(key).clients((err, clients) => {
    //     console.dir(`canvas ${key} clients`);
    //     console.log(clients);
    // })
    const { socket: socketId, move } = req.body;

    const io = req.app.get('io');
    const roomMap = req.app.get('room');
    const canvasMap = req.app.get('canvas');
    const socketMap = req.app.get('socket');
    const key = socketMap.get(socketId);

    const { prev, next } = move;

    console.dir(req.session);
    
    //  defensive code
    if(!roomMap.has(key)) {
        res.send({ error: `There's no available Room #${key}` });
        return res.status(403).end();
    }

    let room = roomMap.get(key);
    const participantSet = new Set(room._participant);
    if(!participantSet.has(req.sessionID)) {
        res.send({ error: `Not Authorized` });
        return res.status(403).end();
    }

    //  check if the room is ready to start
    if(!room._black || !room.white) {
        res.send({ error: `The room is not yet ready to start` });
        return res.status(403).end();
    }

    //  check if it's a player
    const player = room._black === req.sessionID ? 'black': (room._white === req.sessionID ? 'white' : 'spectator');
    console.dir(`player: ${player} (${req.sessionID})`);
    if(player === 'spectator') {
        res.send({ error: `You're just a spectator` });
        return res.status(403).end();
    }
    
    //  check if it's your turn
    if((room.turn % 2 === 0 && player !== 'black') || (room.turn % 2 === 1 && player !== 'white')) {
        res.send({ error: `It's not your turn` });
        return res.status(403).end();
    }

    //  check if piece is player's
    const board = canvasMap.get(key);
    if(board[prev.y][prev.x].owner !== player) {
        res.send({ error: `It's not your piece` });
        return res.status(403).end();
    }

    //  set server board object
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
    
    //  broadcast canvas change to everyone in the room
    io.of('/canvas').to(key).emit('message', {
        type: 'change',
        move,
    });
    
    return res.status(200).end();
};