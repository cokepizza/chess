import express from 'express';
import * as communityCtrl from './communityCtrl';
import loginCheck from '../../lib/auth/loginCheck';

const community = express.Router();

community.get('/', communityCtrl.listPost);
community.get('/:id', communityCtrl.readPost);
community.post('/', loginCheck, communityCtrl.createPost);
community.delete('/:id', communityCtrl.deletePost);

export default community;