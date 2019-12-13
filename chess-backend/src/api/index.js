import express from 'express';
import chat from './chat';
import auth from './auth';
import game from './game';

const router = express.Router();

router.use('/chat', chat);
router.use('/auth', auth);
router.use('/game', game);

export default router;