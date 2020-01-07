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
    res.send({
        id: req.sessionID,
        nickname: req.session.nickname,
    });
    res.status(202).end();
}

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.dir(err);
            res.send(err);
            return res.status(400).end();
        }

        console.dir('login success');
        return req.login(user, (err) => {
            if(err) {
                console.dir(err);
                res.send(err);
                return res.status(400).end();
            };

            res.send(user);
            return res.status(200).end();
        });
    })(req, res, next);
};

export const logout = (req, res, next) => {
    req.logout();
    console.dir('logout success');
    
    // req.session.destroy();
    res.send('logout success');
    res.status(200).end();
};

export const register = async (req, res, next) => {
    const schema = Joi.object().keys({
        username: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
    });

    const result = Joi.validate(req.body, schema);
    if(result.error) {
        console.dir(result.error);
        res.send(result.error);
        return res.status(400).end();
    }

    const { username, password }  = req.body;
    try {
        const exist = await User.findOne({ username });
        if(exist) {
            res.send('the id is already registered');
            return res.status(409).end();
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();

        const serializedUser = user.serialize();
        return req.login(serializedUser, (err) => {
            if(err) {
                console.dir(err);
                res.send(err);
                return res.status(400).end();
            };

            res.send(serializedUser);
            return res.status(202).end();
        });

    } catch(e) {
        console.dir(e);
        res.send(e);
        return res.status(400).end();
    }

};