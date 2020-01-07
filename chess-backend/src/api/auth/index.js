import express from 'express';
import * as authCtrl from './authCtrl';

const auth = express.Router();

auth.get('/getSession', authCtrl.getSession);
auth.post('/login', authCtrl.login);
auth.post('/logout', authCtrl.logout);
auth.post('/register', authCtrl.register);

export default auth;