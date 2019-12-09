import Router from 'koa-router';
import * as chatCtrl from './chatCtrl';

const chat = new Router();

// chat.get('/aaa', ctx => {
//     // console.dir('aaaaa');
//     console.dir(ctx);
// })

chat.post('/sendMessage', chatCtrl.sendMessage);

export default chat;