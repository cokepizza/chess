import ColorHash from 'color-hash';
import passport from 'passport';
import Joi from 'joi';
import User from '../../models/user';

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
    console.dir(req.sessionID);
    console.dir(req.user);
    return res.status(202).send({
        sessionId: req.sessionID,
        nickname: req.session.nickname,
    });
}

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err || info) {
            console.dir(err || info);
            console.dir(err);
            console.dir(info);
            return res.status(400).send(err || info);
        }

        console.dir('login success');
        return req.login(user, err => {
            if(err) {
                console.dir(err);
                return res.status(400).send(err);
            };

            const io = req.app.get('io');
            const sessionID = req.sessionID;

            io.of('/sessionAuth').to(sessionID).emit('message', {
                type: 'initialize',
                ...user,
            });

            return res.status(200).send(user);
        });
    })(req, res, next);
};

export const logout = (req, res, next) => {
    req.logout();
    console.dir('logout success');

    const io = req.app.get('io');
    const sessionID = req.sessionID;

    io.of('/sessionAuth').to(sessionID).emit('message', {
        type: 'clear',
    });
    
    // req.session.destroy();
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