import SocketIO from 'socket.io';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    app.set('auth', {
        sessions: new Set(),
    });

    app.set('mapper', {
        mapSocketToSession: new Map(),
        mapSessionToSocket: new Map(),
    });
    
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
        
        const { nickname, color } = socket.request.session;

        chat.emit('message', {
            type: 'change',
            color,
            message: `welcome ${nickname}`,
        });

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(chat)--------------');
            console.dir(socket.request.sessionID);
        })
    })

    // subscribe Default Namespace
    io.on('connect', socket => {        
        //  io connection시에는 sessionID가 다르지만, 첫 http request 이후 세션 고정
        //  socket과 http request가 동일한 세션을 공유할 수 있음
        
        console.dir('-------------socket(default)--------------');
        console.dir(socket.request.sessionID);

        //  socket.emit()은 소켓이 직접 연결된 세션에만
        //  io.emit()은 연결된 모든 소켓에 broadcast
        
        const { id, nickname, role, color } = socket.request.session;
        
        if(!nickname) return;
       
        const { mapSocketToSession, mapSessionToSocket } = app.get('mapper');
        if(!mapSocketToSession.has(socket.id)) {
            mapSocketToSession.set(socket.id, socket.request.sessionID);
            mapSessionToSocket.set(socket.request.sessionID, socket);
        }

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