import ColorHash from 'color-hash';
import User from '../../models/user';
import passport from 'passport';

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

export const login = passport.authenticate('local', (err, user, info) => {
    console.dir(err);
    console.dir(user);
    console.dir(info);
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

export const register = (req, res, next) => {

};