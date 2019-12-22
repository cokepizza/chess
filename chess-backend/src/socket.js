import SocketIO from 'socket.io';
import defaultBoard from './lib/base/board';
import _ from 'lodash';

const connectRoom = (app, io, socket, key) => {
    //  mapping socket => roomId;
    const socketMap = app.get('socket');
    socketMap.set(socket.id, key);

    //  Broadcasting용 room 업데이트
    socket.join(key);

    //  Server용 room 객체 업데이트
    const roomMap = app.get('room');
    const originRoom = roomMap.get(key);

    //  프론트쪽에 room 없는 접근 redirect하는 코드 넣어둘 것
    if(!originRoom) return;

    const room = { ...originRoom };
    const { nickname } = socket.request.session;

    const sessionId = socket.request.sessionID;
    if(room._participant.has(sessionId)) {
        room._participant.set(sessionId, room._participant.get(sessionId) + 1);
    } else {
        room.participant.push(nickname);
        room._participant.set(sessionId, 1);

        if(!room._white) {
            room.white = nickname;
            room._white = sessionId;
        } else if(!room._black) {
            room.black = nickname;
            room._black = sessionId;
            //  게임 시작 메시지 보내야 함
        }

        io.of('/room').emit('message', {
            type: 'initialize',
            room: [...roomMap.values()],
        });
    }
    console.dir(room);

    roomMap.set(key, room);
}

const disconnectRoom = (app, io, socket, key) => {
    //  delete mapping socket => roomId;
    const socketMap = app.get('socket');
    socketMap.delete(socket.id);

    //  Broadcasting용 room 업데이트
    socket.leave(key);

    //  Server용 room 객체 업데이트
    const roomMap = app.get('room');
    const originRoom = roomMap.get(key);

    //  프론트쪽에 room 없는 접근 redirect하는 코드 넣어둘 것
    if(!originRoom) return;

    const room = { ...originRoom };
    const { nickname } = socket.request.session;

    const sessionId = socket.request.sessionID;
    if(room._participant.has(sessionId)) {
        room._participant.set(sessionId, room._participant.get(sessionId) - 1);

        if(room._participant.get(sessionId) === 0) {
            room._participant.delete(sessionId);
            if(room._black === sessionId) {
                room._black = null;
                room.black = null;
            }
            if(room._white === sessionId) {
                room._white = null;
                room.white = null;
            }
            
            const index = room.participant.findIndex(ele => ele === nickname);
            if(index >= 0) {
                room.participant.splice(index, 1);
            }

            console.dir(room);
            roomMap.set(key, room);

            io.of('/room').emit('message', {
                type: 'initialize',
                room: [...roomMap.values()],
            });
            
            if(room._start && (room._black === null || room._white === null)) {
                room._destory();
            }
        }
    } else {
        // console.dir(room);
        // roomMap.set(key, room);
    }
}

const connectSession = (app, socket) => {
    const sessionId = socket.request.sessionID;
    const sessionMap = app.get('session');

    if(sessionMap.has(sessionId)) {
        const socketSet = sessionMap.get(sessionId);
        socketSet.add(socket);
    } else {
        sessionMap.set(sessionId, new Set([socket]));
    }
}

const disconnectSession = (app, socket) => {
    const sessionId = socket.request.sessionID;
    const sessionMap = app.get('session');

    if(sessionMap.has(sessionId)) {
        const socketSet = sessionMap.get(sessionId);
        socketSet.delete(socket);
    }
}

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    app.set('auth', {
        sessions: new Set(),
    });

    app.set('counter', 0);
    app.set('canvas', new Map());
    app.set('chat', new Map());
    app.set('session', new Map());
    app.set('socket', new Map());

    app.set('room', new Map());

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
            room: [...room.values()],
        });
        
        socket.on('disconnect', () => {
            console.dir('-------------socketDis(room)--------------');
            console.dir(socket.request.sessionID);
        })
    });

    //  subscribe 'Chat' Namespace
    const chat = io.of('/chat');

    chat.on('connect', socket => {
        console.dir('-------------socket(chat)--------------');
        console.dir(socket.request.sessionID);

        //  room join & broadcast
        const key = socket.handshake.query['key'];
        if(!key) return;

        connectRoom(app, io, socket, key);
        connectSession(app, socket);

        const { nickname, color } = socket.request.session;
        const sessionId = socket.request.sessionID;
        const sessionMap = app.get('session');
        const socketSet = sessionMap.get(sessionId);
        const socketIdSet = new Set([...socketSet].map(socket => socket.id));

        //  only broadcast to other sessionIds
        chat.in(key).clients((err, clients) => {
            clients.forEach(client => {
                if(!socketIdSet.has(client)) {
                    chat.connected[client].emit('message', {
                        type: 'change',
                        color,
                        message: `${nickname} join the game`,
                    })
                }
            });
        });
        
        //  only broadcast to my socket
        socket.emit('message', {
            type: 'initialize',
            color,
            message: `welcome ${nickname}`,
        });

        socket.on('disconnect', () => {
            disconnectRoom(app, io, socket, key);
            disconnectSession(app, socket);

            console.dir('-------------socketDis(chat)--------------');
            console.dir(socket.request.sessionID);
        })
    })

    //  subscribe 'Canvas' Namespace
    const canvas = io.of('/canvas');

    canvas.on('connect', socket => {
        console.dir('-------------socket(canvas)--------------');
        console.dir(socket.request.sessionID);

        //  프론트쪽에 key 없는 접근 redirect하는 코드 넣어둘 것 (서버쪽에서 message를 보내면 좋을 듯)
        const key = socket.handshake.query['key'];
        if(!key) return;
       
        connectRoom(app, io, socket, key);

        //  canvas initialize
        const canvasMap = app.get('canvas');
        let board;
        if(canvasMap.has(key)) {
            board = canvasMap.get(key);
        } else {
            board = _.cloneDeep(defaultBoard);
            canvasMap.set(key, board);
        }

        socket.emit('message', {
            type: 'initialize',
            board,
        })
        
        socket.on('disconnect', () => {
            disconnectRoom(app, io, socket, key);

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
        console.dir(socket.id);
        //  socket.emit()은 소켓이 직접 연결된 세션에만
        //  io.emit()은 연결된 모든 소켓에 broadcast
        
        const { nickname, role, color } = socket.request.session;
        
        if(!nickname) return;
       
        // const { mapSocketToSession, mapSessionToSocket } = app.get('mapper');
        // if(!mapSocketToSession.has(socket.id)) {
        //     mapSocketToSession.set(socket.id, socket.request.sessionID);
        //     mapSessionToSocket.set(socket.request.sessionID, socket);
        // }

        socket.emit('message', {
            type: 'initialize',
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