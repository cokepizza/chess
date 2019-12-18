import SocketIO from 'socket.io';
import defaultBoard from './lib/base/board';
import _ from 'lodash';

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
        
        const { nickname, color } = socket.request.session;

        //  room join & broadcast
        const key = socket.handshake.query['key'];
        if(!key) return;

        socket.join(key);
        socket.broadcast.to(key).emit('message', {
            type: 'change',
            color,
            message: `${nickname} join the game`,
        });

        //  socket only
        socket.emit('message', {
            type: 'change',
            color,
            message: `welcome ${nickname}`,
        });

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(chat)--------------');
            console.dir(socket.request.sessionID);
        })
    })

    //  subscribe 'Canvas' Namespace
    const canvas = io.of('/canvas');

    canvas.on('connect', socket => {
        console.dir('-------------socket(canvas)--------------');
        console.dir(socket.request.sessionID);
        
        // 필요하다면 동일 sessionID간의 socket 객체들간에 room을 만들어 관리하는 방법도 생각해볼 수 있음
        // canvas.in(key).clients((err, clients) => {
        //     console.log(clients);
        // })
        
        const { nickname } = socket.request.session;

        //  session = socket bundle (add socket to session)
        const sessionMap = app.get('session');
        if(sessionMap.has(socket.request.sessionID)) {
            sessionMap.get(socket.request.sessionID).add(socket.id);
        } else {
            sessionMap.set(socket.request.sessionID, new Set([ socket.id ]));
        }

        //  filter
        //  프론트쪽에 key 없는 접근 redirect하는 코드 넣어둘 것 (서버쪽에서 message를 보내면 좋을 듯)
        const key = socket.handshake.query['key'];
        if(!key) return;
       
        //  room join
        socket.join(key);
        
        //  mapping socket => roomId;
        const socketMap = app.get('socket');
        socketMap.set(socket.id, key);

        //  room객체 추가 정보는 canvas쪽에서 일괄처리
        const roomMap = app.get('room');
        const room = roomMap.get(key);

        //  프론트쪽에 room 없는 접근 redirect하는 코드 넣어둘 것
        if(!room) return;
        
        const participantSet = new Set(room._participant);
        if(!participantSet.has(socket.request.sessionID)) {
            room.participant.push(nickname);
            room._participant.push(socket.request.sessionID);
            
            if(room._participant.length == 1) {
                room.black = nickname;
                room._black = socket.request.sessionID;
            } else if(room._participant.length == 2) {
                room.white = nickname;
                room._white = socket.request.sessionID;
            }
        }
        
        console.dir(room);
        
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
        
        //  session key update
        // const roomKey = socket.request.session.key;
        // if(!roomKey || roomKey !== key) {
        //     socket.request.session.key = key;    
        // }

        // socket.request.session.save();
        socket.on('disconnect', () => {
            //  session = socket bundle (delete socket from session)
            sessionMap.get(socket.request.sessionID).delete(socket.id);
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