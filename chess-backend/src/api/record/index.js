import express from 'express';
import * as recordCtrl from './recordCtrl';

const record = express.Router();

record.post('/sendSurrender', recordCtrl.sendSurrender);

export default record;