let turn = 'black';

export const movePiece = (req, res, next) => {
    const io = req.app.get('io');
    const move = req.body;
    const { role } = req.session;
    
    //  정확히 role이 맞는지 검증하는 작업 필요
    //  app.set()을 통해 player 정보랑 sessionID 저장해둬야 함

    console.dir('----------http(movePiece)---------')
    console.dir(req.sessionID);

    if(!role || role === 'spectator') {
        res.send({ error: 'Not Authorized' });
        res.status(403).end();
    } else {
        if(role !== turn) {
            res.send({ error: `It's not your turn` });
            res.status(403).end();
        } else {
            console.dir(role);
            console.dir(turn);
            console.dir(req.sessionID);
            io.of('canvas').emit('message', {
                type: 'change',
                move,
            });
            turn = (turn === 'black' ? 'white' : 'black');
            res.status(200).end();
        }
    }
};