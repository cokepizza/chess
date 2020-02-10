import ColorHash from 'color-hash';
import passport from 'passport';
import Joi from 'joi';
import User from '../../models/user';
import instanceSanitizer from '../../lib/util/instanceSanitizer';

/* SocketIO 연결 전, 첫 세션 생성 시점 */
export const getSession = (req, res, next) => {
    if(!req.session.nickname) {
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);

        let counter = req.app.get('counter');
        req.session.nickname = `Guest#${counter}`;
        req.app.set('counter', (counter+1) % 100000);
    }

    req.session.save();

    console.dir('----------http(getSession)---------')
    // console.dir(req.sessionID);
    // console.dir(req.user);
    return res.status(202).send({
        sessionId: req.sessionID,
        nickname: req.session.nickname,
    });
}

const loginMode = req => {
    const io = req.app.get('io');
    const gameMap = req.app.get('game');
    const sessionToKey = req.app.get('session');

    if(sessionToKey.has(req.sessionID)) {
        const keyToChannel = sessionToKey.get(req.sessionID);
        if(keyToChannel) {
            [...keyToChannel.keys()].forEach(key => {
                const game = gameMap.get(key);
                if(!game) return;
                
                const index = game.participant.findIndex(ele => ele === req.session.nickname);
                if(index >= 0) {
                    game.participant.splice(index, 1, req.user.username);
                }

                const channelToSocket = keyToChannel.get(key);
                if(channelToSocket) {
                    const gameSocketSet = channelToSocket.get('/game');
                    if(gameSocketSet) {
                        [...gameSocketSet].forEach(socket => {
                            socket.request.session.passport = {
                                user: {
                                    ...req.user
                                }
                            };
                        });
                    }

                    //  session 객체는 참조로 유지되고 있음
                    //  game채널의 socket을 통한 session 변경은 socketAuth 채널에도 적용됨
                    const socketAuthSocketSet = channelToSocket.get('/socketAuth');
                    if(socketAuthSocketSet) {
                        [...socketAuthSocketSet].forEach(socket => {
                            game._socketAuth._initialize(socket);
                            game._socketAuth._unicast(socket);
                        });
                    }
                }

                const participantSet = new Set(game.participant);
                if(game._init && (!participantSet.has(game.white) || !participantSet.has(game.black))) {
                    if(!participantSet.has(game.white)) {
                        game._destroy({
                            draw: false,
                            winner: game.black,
                            loser: game.white,
                        });
                    }
                    if(!participantSet.has(game.black)) {
                        game._destroy({
                            draw: false,
                            winner: game.white,
                            loser: game.black,
                        });
                    }
                } else {
                    game._heartbeat();
                }
            });

            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...instanceSanitizer([...gameMap.values()])],
            });
        }
    }
}

const logoutMode = req => {
    const io = req.app.get('io');
    const gameMap = req.app.get('game');
    const sessionToKey = req.app.get('session');

    if(sessionToKey.has(req.sessionID)) {
        const keyToChannel = sessionToKey.get(req.sessionID);
        if(keyToChannel) {
            [...keyToChannel.keys()].forEach(key => {
                const game = gameMap.get(key);
                if(!game) return;
                const index = game.participant.findIndex(ele => ele === req.user.username);
                if(index >= 0) {
                    game.participant.splice(index, 1, req.session.nickname);
                }

                const channelToSocket = keyToChannel.get(key);
                if(channelToSocket) {
                    const gameSocketSet = channelToSocket.get('/game');
                    if(gameSocketSet) {
                        [...gameSocketSet].forEach(socket => {
                            if(socket.request.session) {
                                delete socket.request.session.passport;
                            }
                        });
                    }

                    const socketAuthSocketSet = channelToSocket.get('/socketAuth');
                    if(socketAuthSocketSet) {
                        [...socketAuthSocketSet].forEach(socket => {
                            game._socketAuth._initialize(socket);
                            game._socketAuth._unicast(socket);
                        })
                    }
                }

                const participantSet = new Set(game.participant);
                if(game._init && (!participantSet.has(game.white) || !participantSet.has(game.black))) {
                    if(!participantSet.has(game.white)) {
                        game._destroy({
                            draw: false,
                            winner: game.black,
                            loser: game.white,
                        });
                    }
                    if(!participantSet.has(game.black)) {
                        game._destroy({
                            draw: false,
                            winner: game.white,
                            loser: game.black,
                        });
                    }
                } else {
                    game._heartbeat();
                }
            });

            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...instanceSanitizer([...gameMap.values()])],
            });
        }
    }
}

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err || info) {
            console.dir(err || info);
            return res.status(400).send(err || info);
        }

        console.dir('login success');
        return req.login(user, err => {
            if(err) {
                console.dir(err);
                return res.status(400).send(err);
            };

            loginMode(req);

            const io = req.app.get('io');
            io.of('/sessionAuth').to(req.sessionID).emit('message', {
                type: 'initialize',
                ...user,
            });

            return res.status(200).send(user);
        });
    })(req, res, next);
};

export const logout = (req, res, next) => {
    
    logoutMode(req);

    req.logout();
    // req.session.destroy();

    console.dir('logout success');

    const io = req.app.get('io');
    io.of('/sessionAuth').to(req.sessionID).emit('message', {
        type: 'clear',
    });
   
    return res.status(200).send('logout success');
};

export const register = async (req, res, next) => {
    const schema = Joi.object().keys({
        username: Joi.string().max(80).email({ minDomainAtoms: 2 }).required().error(() => ({ message: 'Wrong format' })),
        password: Joi.string().min(4).max(16).required().error(() => ({ message: '4 ~ 16 digits' })),
    });

    const result = Joi.validate(req.body, schema, { abortEarly: false });
    if(result.error) {
        let nextError = {};
        result.error.details.forEach(detail => {
            if(!nextError[detail.path[0]]) {
                nextError = {
                    ...nextError,
                    [detail.path[0]]: detail.message,
                }
            }
        });
        console.dir(result.error);
        return res.status(400).send({ ...nextError });
    }

    const { username, password }  = req.body;
    try {
        const exist = await User.findOne({ username });
        if(exist) {
            return res.status(409).send({ username: 'Registered user' });
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();

        const serializedUser = user.serialize();
        return req.login(serializedUser, err => {
            if(err) {
                console.dir(err);
                return res.status(400).send(err);
            };

            loginMode(req);

            const io = req.app.get('io');
            const sessionID = req.sessionID;

            io.of('/sessionAuth').to(sessionID).emit('message', {
                type: 'initialize',
                ...serializedUser,
            });

            return res.status(200).send(serializedUser);
        });

    } catch(e) {
        console.dir(e);
        return res.status(400).send(e);
    }

};

export const check = (req, res, next) => {
    return res.status(200).send(req.user);
};