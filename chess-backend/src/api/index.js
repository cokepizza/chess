import express from 'express';
import chat from './chat';

const router = express.Router();

router.use('/chat', chat);

export default router;