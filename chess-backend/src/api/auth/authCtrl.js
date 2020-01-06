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
    res.send(req.sessionID);
    res.status(202).end();
}

export const login = passport.authenticate('local', (req, res) => {
    console.dir(req);
    console.dir(res);
    res.send(user);
})


// export const login = (req, res, next) => {
//     const { username, password } = req.body;
    
//     if(!username || !password) {
//         res.send({ error: 'Please fill the form' });
//         return res.status(202).end();
//     }
// };

export const logout = (req, res, next) => {

};

export const register = async (req, res, next) => {
    const schema = Joi.object().keys({
        username: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
    });

    console.dir(req.body);
    const result = Joi.validate(req.body, schema);
    if(result.error) {
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
        console.dir(req);
        // req.login();

    } catch(e) {
        res.send(e);
        return res.status(400).end();
    }

};