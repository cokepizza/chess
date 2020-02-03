export const asking = (req, res) => {
    const { socket: socketId, type } = req.body;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const gameMap = req.app.get('game');

    if(!gameMap.has(key)) {
        console.dir(`There's no available Game #${key}`);
        return res.status(403).send({ error: `There's no available Game #${key}` });
    }

    const game = gameMap.get(key);
    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        return res.status(403).send({ error: `You're just a spectator` });
    }

    if(game._record.blocked) {
        console.dir(`Modal is already Open`);
        return res.status(403).send({ error: `Modal is already Open` });
    }

    if(game._record._asking) {
        console.dir(`This request(asking) is still processing`);
        return res.status(403).send({ error: `This request(asking) is still processing` });
    }

    const enemy = player === 'white' ? 'black' : 'white';
    
    game._record._asking = true;

    game._record._modalOpen({
        sender: player,
        receiver: enemy,
        genre: type,
    })

    clearTimeout(game._record._setTimeRequestMessageRef[type]);
    clearTimeout(game._record._setTimeRequestCloseRef[type]);

    game._record._setTimeRequestMessageRef[type] = setTimeout(() => {
        const game = gameMap.get(key);
        if(game && game.start) {
            game._record._modalMessage({
                sender: enemy,
                receiver: player,
                genre: type,
                message: 'rejected',
            });
        }
        game._record._setTimeRequestCloseRef[type] = setTimeout(() => {
            const game = gameMap.get(key);
            if(game && game.start) {
                game._record._asking = false;
                game._record._answering = false;
                game._record._modalClose({
                    sender: player,
                    receiver: enemy,
                });
            }
        }, 3000);
    }, 5000);

    return res.status(202).end();
};

export const answering = (req, res) => {
    const { socket: socketId, type, response } = req.body;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const gameMap = req.app.get('game');
    const game = gameMap.get(key);
    const io = req.app.get('io');

    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        return res.status(403).send({ error: `You're just a spectator` });
    }
    
    if(!game._record.blocked) {
        console.dir(`Modal is already Closed`);
        return res.status(403).send({ error: `Modal is already Closed` });
    }

    if(game._record._answering) {
        console.dir(`This request(answer) is still processing`);
        return res.status(403).send({ error: `This request(asking) is still processing` });
    }

    const enemy = player === 'white' ? 'black' : 'white';
    const message = response ? 'accepted' : 'rejected';

    game._record._answering = true;
    
    clearTimeout(game._record._setTimeRequestMessageRef[type]);
    clearTimeout(game._record._setTimeRequestCloseRef[type]);

    game._record._modalMessage({
        sender: player,
        receiver: enemy,
        genre: type,
        message,
    });

    game._record._setTimeRequestCloseRef[type] = setTimeout(() => {
        const game = gameMap.get(key);
        if(game && game.start) {
            game._record._asking = false;
            game._record._answering = false;
            game._record._modalClose({
                sender: player,
                receiver: enemy,
            });
        }
    }, 3000);

    if(response) {
        if(type === 'surrender') {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `Request for surrender has been accepted`,
            });
            game._destroy({
                draw: false,
                winner: game[enemy],
                loser: game[player],
            })
        } else if(type === 'draw') {
            io.of('/chat').to(key).emit('message', {
                type: 'change',
                message: `Request for draw has been accepted`,
            });
            game._destroy({
                draw: true,
                winner: game[enemy],
                loser: game[player],
            })
        } else if(type === 'undo') {
    
        }
    }
    
    return res.status(202).end();
}