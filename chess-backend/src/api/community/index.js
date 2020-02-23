import express from 'express';
import * as communityCtrl from './communityCtrl';

const community = express.Router();

community.post('/', communityCtrl.createPost);

export default community;