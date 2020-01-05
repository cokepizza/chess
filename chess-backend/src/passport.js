import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const passportConfig = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        session: true,
        passReqToCallback: true,
    }, (req, id, password, done) => {

    }));
};

export default passportConfig;