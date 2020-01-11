import express from 'express';
import * as gamesCtrl from './gamesCtrl';

const games = express.Router();

games.post('/', gamesCtrl.createGame);

export default games;