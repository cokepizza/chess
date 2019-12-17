export const movePiece = (req, res) => {
    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);

    const io = req.app.get('io');
    const roomMap = req.app.get('room');
    const canvasMap = req.app.get('canvas');
    
    const move = req.body;
    const roomKey = req.session.key;
    const { prev, next } = move;

    console.dir(req.session);
    
    if(!roomMap.has(roomKey)) {
        res.send({ error: `There's no available Room #${roomKey}` });
        return res.status(403).end();
    }

    const room = roomMap.get(roomKey);
    const participantSet = new Set(room._participant);
    if(!participantSet.has(req.sessionID)) {
        res.send({ error: `Not Authorized` });
        return res.status(403).end();
    }

    const player = room._black === req.sessionID ? 'black': (room._white === req.sessionID ? 'white' : 'spectator');
    if(player === 'spectator') {
        res.send({ error: `You're just a spectator` });
        return res.status(403).end();
    }

    const board = canvasMap.get(roomKey);
    if(board[prev.y][prev.x].owner !== player) {
        res.send({ error: `It's not your turn` });
        return res.status(403).end();
    }

    io.of('/canvas').emit('message', {
        type: 'change',
        move,
    });
    
    return res.status(200).end();
};