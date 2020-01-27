require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import greenlock from 'greenlock-express';
import https from 'https';
import http from 'http';

import api from './api';
import socket from './socket';
import passport from 'passport';
import passportConfig from './passport';
import dbConfig from './database';
import cache from './cache';

const initializer = async () => {
    await dbConfig();
    return await cache();
}

const server = data => {
    const app = express();

    const sessionMiddleware = session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'chess',
    });

    const lex = greenlock.create({
        version: 'draft-11',
        configDir: '/etc/letsencrypt',
        server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
        approveDomains: (opts, certs, cb) => {
          if (certs) {
            opts.domains = ['chesssup.com', 'www.chesssup.com'];
          } else {
            opts.email = 'lsjphd@gmail.com';
            opts.agreeTos = true;
          }
          cb(null, { options: opts, certs });
        },
        renewWithin: 81 * 24 * 60 * 60 * 1000,
        renewBy: 80 * 24 * 60 * 60 * 1000,
    });
    
    app.set('views', path.join(__dirname, 'views'));
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, '../../chess-frontend/build')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({credentials: true, origin: true}));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api', api);
    app.set('port', process.env.PORT || 4000);

    passportConfig();

    Object.keys(data).forEach(key => {
        app.set(key, data[key]);
    });
    
    const server = https.createServer(lex.httpsOptions, lex.middleware(app)).listen(process.env.SSL_PORT || 443);
    http.createServer(lex.middleware(require('redirect-https')())).listen(process.env.PORT || 80);

    //  라우팅 로직을 제외한 모든 get요청
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../../chess-frontend/build', 'index.html'));
    });
    
    // const server = app.listen(app.get('port'), () => {
    //     console.dir(`Port ${app.get('port')} => listening~`);
    // })
    
    socket(server, app, sessionMiddleware);
}

initializer().then(data => {
    server(data);
});