import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user';

const passportConfig = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: true,
    }, (req, username, password, done) => {

        console.dir(req);
        if(!username || !password) {
            return done(null, false, { message: 'Please fill the form' });
        }
        
        const user = User.findOne({ username });
        
    }));
};

export default passportConfig;