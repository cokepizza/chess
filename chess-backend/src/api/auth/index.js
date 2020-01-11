import express from 'express';
import * as authCtrl from './authCtrl';
import isAuthenticated from '../../lib/util/isAuthenticated';

const auth = express.Router();

auth.get('/getSession', authCtrl.getSession);
auth.post('/login', authCtrl.login);
auth.post('/logout', authCtrl.logout);
auth.post('/register', authCtrl.register);
auth.get('/check', isAuthenticated, authCtrl.check);

export default auth;