import express from 'express';
import * as roomCtrl from './roomCtrl';

const room = express.Router();

room.get('/', roomCtrl.readRoom);
room.post('/', roomCtrl.createRoom);

export default room;