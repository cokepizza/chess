export const movePiece = (req, res) => {
    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);

    const io = req.app.get('io');
    const roomMap = req.app.get('room');
    const canvasMap = req.app.get('canvas');
    
    const move = req.body;
    const key = req.session.key;
    const { prev, next } = move;

    console.dir(req.session);
    
    if(!roomMap.has(key)) {
        res.send({ error: `There's no available Room #${key}` });
        return res.status(403).end();
    }

    const room = roomMap.get(key);
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

    const board = canvasMap.get(key);
    if(board[prev.y][prev.x].owner !== player) {
        res.send({ error: `It's not your turn` });
        return res.status(403).end();
    }

    const copied = { ...board[prev.y][prev.x]};
    board[prev.y][prev.x] = {
        covered: false
    };
    board[next.y][next.x] = copied;

    io.of('/canvas').to(key).emit('message', {
        type: 'change',
        move,
    });
    
    return res.status(200).end();
};