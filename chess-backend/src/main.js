require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import ws from 'ws';
import Io from 'koa-socket-2';

const app = new Koa();
const io = new Io();
const router = new Router();
const { PORT } = process.env;

// let count = 0;
// const wws = new ws.Server({ port: 4000 });
// wws.on('connection', ws => {
//     console.dir('connection complete');
//     ws.on('message', message => {
//         console.log(`message: ${message}`);
//     })
//     setInterval(() => {
//         console.dir('we send');
//         ws.send(`count: ${count++}`);
//     }, 1000)
// })


app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

io.attach(app);

let count = 0;
io.on('connection', socket => {
    console.dir('connect~~');
    setInterval(() => {
        socket.emit('message', count++);
    }, 1000);
    // socket.on('message', msg => {
    //     console.dir(msg);
    // })
});



const port = PORT || 4000;
app.listen(4000, () => {
    console.log('Listening to port 4000');
});