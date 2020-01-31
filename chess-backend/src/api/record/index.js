import express from 'express';
import * as recordCtrl from './recordCtrl';

const record = express.Router();

record.post('/asking', recordCtrl.asking);

export default record;