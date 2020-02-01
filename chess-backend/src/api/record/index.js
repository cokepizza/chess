import express from 'express';
import * as recordCtrl from './recordCtrl';

const record = express.Router();

record.post('/asking', recordCtrl.asking);
record.post('/answering', recordCtrl.answering);

export default record;