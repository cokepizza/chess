require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import api from './api';
import socket from './socket';

const app = express();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'chess',
});

app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../../chess-frontend/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use('/api', api);
app.set('port', process.env.PORT || 4000);

//  라우팅 로직을 제외한 모든 get요청
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../chess-frontend/build', 'index.html'));
});

const server = app.listen(app.get('port'), () => {
    console.dir(`Port ${app.get('port')} => listening~`);
})

socket(server, app, sessionMiddleware);

