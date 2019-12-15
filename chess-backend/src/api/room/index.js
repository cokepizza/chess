import express from 'express';
import * as roomCtrl from './roomCtrl';

const room = express.Router();

room.post('/', roomCtrl.createRoom);

export default room;