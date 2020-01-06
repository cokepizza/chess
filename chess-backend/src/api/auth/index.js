import express from 'express';
import * as authCtrl from './authCtrl';

const auth = express.Router();

auth.get('/getSession', authCtrl.getSession);
auth.post('/login', authCtrl.login);

export default auth;