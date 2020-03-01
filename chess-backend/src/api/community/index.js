import express from 'express';
import * as communityCtrl from './communityCtrl';
import loginCheck from '../../lib/auth/loginCheck';
import checkOwnPost from '../../lib/auth/checkOwnPost';

const community = express.Router();

community.get('/', communityCtrl.listPost);
community.get('/:id', communityCtrl.readPost);
community.post('/', loginCheck, communityCtrl.createPost);
community.delete('/:id', checkOwnPost, communityCtrl.deletePost);
community.patch('/:id', checkOwnPost, communityCtrl.updatePost);

export default community;