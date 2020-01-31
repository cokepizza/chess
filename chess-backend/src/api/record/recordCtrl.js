export const sendSurrender = (req, res) => {
    const { socket: socketId } = req.body;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const gameMap = req.app.get('game');
    const game = gameMap.get(key);

    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    const enemy = player === 'white' ? 'black' : 'white';

    const socketSet = req.app.get('session').get(game._[enemy]).get(key).get('/record');
    console.dir(socketSet);
    [ ...socketSet ].forEach(socket => {
        socket.emit('message', {
            type: 'notify',
            message: 'surrender request',
        })
    });
};