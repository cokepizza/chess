import express from 'express';
import * as chatCtrl from './chatCtrl';

const chat = express.Router();

chat.post('/sendMessage', chatCtrl.sendMessage);

export default chat;