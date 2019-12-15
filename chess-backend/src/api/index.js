import express from 'express';
import chat from './chat';
import auth from './auth';
import game from './game';
import room from './room';

const router = express.Router();

router.use('/chat', chat);
router.use('/auth', auth);
router.use('/game', game);
router.use('/room', room);

export default router;