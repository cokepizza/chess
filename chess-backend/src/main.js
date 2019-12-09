require('dotenv').config();
require('dotenv').config();
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import api from './api';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use('/api', api);
app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
    console.dir(`Port ${app.get('port')} => listening~`);
})

