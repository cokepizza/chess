require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import ws from 'ws';
import { WSASERVICE_NOT_FOUND } from 'constants';

const app = new Koa();
const router = new Router();
const { PORT } = process.env;

const wws = new ws.Server({ port: 4000 });

let count = 0;
wws.on('connection', ws => {
    console.dir('connection complete');
    ws.on('message', message => {
        console.log(`message: ${message}`);
    })
    setInterval(() => {
        console.dir('we send');
        ws.send(`count: ${count++}`);
    }, 1000)
})


app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

// const port = PORT || 4000;
app.listen(5000, () => {
    console.log('Listening to port 4000');
})