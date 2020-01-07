import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user';

const passportConfig = () => {
    passport.serializeUser((user, done) => {
        // console.dir('serializeUser');
        // console.dir(user);
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.dir('deserializeUser');
        console.dir(user);
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: true,
    }, async (req, username, password, done) => {

        if(!username || !password) {
            return done(null, false, { message: 'Please fill the form' });
        }
        
        console.dir(username);
        console.dir(password);
        try {
            const user = await User.findOne({ username });
            console.dir(user);

            if(!user) {
                return done(null, false, { message: 'No valid user exist' });
            }

            const pwCheck = await user.checkPassword(password);
            
            if(!pwCheck) {
                return done(null, false, { message: 'password mismatch' });
            }

            return done(null, { user: user.serialize() });
        } catch(e) {
            return done(e);
        }    
    }));
};

export default passportConfig;