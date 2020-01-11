import express from 'express';
import auth from './auth';
import chat from './chat';
import canvas from './canvas';
import games from './games';

const router = express.Router();

router.use('/auth', auth);
router.use('/chat', chat);
router.use('/canvas', canvas);
router.use('/games', games);

export default router;