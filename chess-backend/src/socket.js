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
        const originRoom = roomMap.get(key);

        //  프론트쪽에 room 없는 접근 redirect하는 코드 넣어둘 것
        if(!originRoom) return;
        const room = { ...originRoom };
        
        const sessionId = socket.request.sessionID;
        if(room._participant.has(sessionId)) {
            room._participant.set(sessionId, room._participant.get(sessionId) + 1);
        } else {
            room.participant.push(nickname);
            room._participant.set(sessionId, 1);
        }
        
        if(!room._black) {
            room.black = nickname;
            room._black = sessionId;
        } else if(!room._white) {
            room.white = nickname;
            room._white = sessionId;

            //  게임 시작 메시지 보내야 함
        }

        roomMap.set(key, room);
        
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
            //  synchronize room object with real room
            socketMap.delete(socket.id);
            const originRoom = roomMap.get(key);
            const room = { ...originRoom };

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
            }

            roomMap.set(key, room);
            console.dir(room);
            if(room._start && (room._black === null || room._white === null)) {
                room._destory();
            }
            
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