let turn = 'black';

export const movePiece = (req, res, next) => {
    const io = req.app.get('io');
    const { move } = req.body;
    const { role } = req.session;

    if(!role || role === 'spectator') {
        res.send({ error: 'Not Authorized' });
        res.status(403).end();
    } else {
        if(role !== turn) {
            res.send({ error: `It's not your turn` });
            res.status(403).end();
        } else {
            io.emit('message', {
                type: 'game',
                move,
            });
            turn = (turn === 'black' ? 'white' : 'black');
            res.status(200).end();
        }
    }
};