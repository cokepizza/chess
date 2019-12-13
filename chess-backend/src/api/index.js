import express from 'express';
import chat from './chat';
import auth from './auth';

const router = express.Router();

router.use('/chat', chat);
router.use('/auth', auth);

export default router;