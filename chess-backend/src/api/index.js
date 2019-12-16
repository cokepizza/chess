import express from 'express';
import auth from './auth';
import chat from './chat';
import canvas from './canvas';
import room from './room';

const router = express.Router();

router.use('/auth', auth);
router.use('/chat', chat);
router.use('/canvas', canvas);
router.use('/room', room);

export default router;