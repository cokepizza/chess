import express from 'express';
import * as authCtrl from './authCtrl';

const auth = express.Router();

auth.get('/getSession', authCtrl.getSession);

export default auth;