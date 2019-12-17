import SocketIO from 'socket.io';
import defaultBoard from './lib/base/board';
import _ from 'lodash';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    app.set('auth', {
        sessions: new Set(),
    });

    // app.set('mapper', {
    //     room: {
    //         mapSocketToSession: new Map(),
    //         mapSessionToSocket: new Map(),
    //     },
    //     canvas: {
    //         mapSocketToSession: new Map(),
    //         mapSessionToSocket: new Map(),
    //     },
    //     chat: {
    //         mapSocketToSession: new Map(),
    //         mapSessionToSocket: new Map(),
    //     }
    // });

    app.set('counter', 0);
    app.set('canvas', new Map());
    app.set('chat', new Map());

    app.set('room', []);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    //  subscribe 'Room' Namespace
    const room = io.of('/room');

    room.on('connect', socket => {
        console.dir('-------------socket(room)--------------');
        console.dir(socket.request.sessionID);
        const room = app.get('room');
        
        socket.emit('message', {
            type: 'initialize',
            room,
        });
        
        socket.on('disconnect', () => {
            console.dir('-------------socketDis(room)--------------');
            console.dir(socket.request.sessionID);
        })
    });

    const chat = io.of('/chat');

    chat.on('connect', socket => {
        console.dir('-------------socket(chat)--------------');
        console.dir(socket.request.sessionID);
          
        //  room join
        const key = socket.handshake.query['key'];
        socket.join(key, () => {
            let rooms = Object.keys(socket.rooms);
            console.dir('-------------socket(chatjoin)--------------');
            console.dir(rooms);
        });

        // chat.in(key).clients((err, clients) => {
        //     console.dir(clients);
        // });

        //  session key update
        const roomKey = socket.request.session.key;
        if(!roomKey || roomKey !== key) {
            socket.request.session.key = key;
            socket.request.session.save();
        }
        
        const { nickname, color } = socket.request.session;

        //  send message respectively
        socket.emit('message', {
            type: 'change',
            color,
            message: `welcome ${nickname}`,
        });
        // chat.emit('message', {
        //     type: 'change',
        //     color,
        //     message: `welcome ${nickname}`,
        // });
        // chat.in(key).broadcast.emit('message', {
        //     type: 'change',
        //     color,
        //     message: `welcome ${nickname}`,
        // });

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(chat)--------------');
            console.dir(socket.request.sessionID);
        })
    })

    const canvas = io.of('/canvas');

    canvas.on('connect', socket => {
        console.dir('-------------socket(canvas)--------------');
        console.dir(socket.request.sessionID);
        // const { mapSocketToSession, mapSessionToSocket } = app.get('mapper');
        // if(!mapSocketToSession.has(socket.id)) {
        //     mapSocketToSession.set(socket.id, socket.request.sessionID);
        //     mapSessionToSocket.set(socket.request.sessionID, socket);
        // }
        
        //  room join
        const key = socket.handshake.query['key'];
        socket.join(key, () => {
            let rooms = Object.keys(socket.rooms);
            console.dir('-------------socket(canvasjoin)--------------');
            console.dir(rooms);
        });

        //  session key update
        const roomKey = socket.request.session.key;
        if(!roomKey || roomKey !== key) {
            socket.request.session.key = key;
            socket.request.session.save();
        }

        //  canvas initialize to socket
        const canvas = app.get('canvas');
        let board;
        if(canvas.has(key)) {
            board = canvas.get(key);
        } else {
            board = _.cloneDeep(defaultBoard);
            canvas.set(key, board);
        }

        socket.emit('message', {
            type: 'initialize',
            board,
        })

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(canvas)--------------');
            console.dir(socket.request.sessionID);
        });
    });

    // subscribe Default Namespace
    const auth = io.of('/auth');
    auth.on('connect', socket => {      
        //  io connection시에는 sessionID가 다르지만, 첫 http request 이후 세션 고정
        //  socket과 http request가 동일한 세션을 공유할 수 있음
        
        console.dir('-------------socket(default)--------------');
        console.dir(socket.request.sessionID);

        //  socket.emit()은 소켓이 직접 연결된 세션에만
        //  io.emit()은 연결된 모든 소켓에 broadcast
        
        const { id, nickname, role, color } = socket.request.session;
        
        if(!nickname) return;
       
        // const { mapSocketToSession, mapSessionToSocket } = app.get('mapper');
        // if(!mapSocketToSession.has(socket.id)) {
        //     mapSocketToSession.set(socket.id, socket.request.sessionID);
        //     mapSessionToSocket.set(socket.request.sessionID, socket);
        // }

        socket.emit('message', {
            type: 'initialize',
            id,
            nickname,
            role,
            color,
        });

        // const { sessions } = app.get('auth');
        // if(!sessions.has(socket.request.sessionID)) {
        //     sessions.add(socket.request.sessionID);
        // }

        socket.on('message', () => {
            console.dir('-------------serveronMessage--------------')
            console.dir(socket.request.sessionID);
        });

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(default)--------------')
            console.dir(socket.request.sessionID);
        })
    })
};