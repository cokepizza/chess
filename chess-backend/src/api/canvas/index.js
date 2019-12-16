import express from 'express';
import * as canvasCtrl from './canvasCtrl';

const canvas = express.Router();

canvas.post('/movePiece', canvasCtrl.movePiece);

export default canvas;
