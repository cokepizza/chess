import express from 'express';
import * as gameCtrl from './gameCtrl';

const game = express.Router();

game.post('/movePiece', gameCtrl.movePiece);

export default game;
