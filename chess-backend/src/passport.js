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
        // console.dir('deserializeUser');
        // console.dir(user);
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true,
        passReqToCallback: true,
    }, async (req, username, password, done) => {

        if(!username || !password) {
            let message = {};
            const mention = 'Required field';

            if(!username) {
                message = {
                    ...message,
                    username: mention
                }
            }
            if(!password) {
                message = {
                    ...message,
                    password: mention
                }
            }

            return done(null, false, { ...message });
        }
        
        try {
            const user = await User.findOne({ username });

            if(!user) {
                return done(null, false, { username: 'Unknown user' });
            }

            const pwCheck = await user.checkPassword(password);
            
            if(!pwCheck) {
                return done(null, false, { password: 'Invalid password' });
            }

            return done(null, user.serialize());
        } catch(e) {
            return done(e);
        }
    }));
};

export default passportConfig;