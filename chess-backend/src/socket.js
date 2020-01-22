import SocketIO from 'socket.io';
import _ from 'lodash';

import defaultBoard from './lib/base/board';
import instanceSanitizer from './lib/util/instanceSanitizer';

const connectSocket = (app, io, socket, key) => {
    const channel = socket.id.split('#')[0];
    const { nickname, passport } = socket.request.session;
    const sessionId = socket.request.sessionID;
    const passportUser = passport ? passport.user : null;
    const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
    const auth = (passportUser && passportUser.username) ? true : false;

    //  mapping socket => gameId
    const socketToKeyMap = app.get('socketToKey');
    socketToKeyMap.set(socket.id, key);
    
    //  mapping socket => session
    const socketToSessionMap = app.get('socketToSession');
    socketToSessionMap.set(socket.id, socket.request.sessionID);

    //  Game(key) based service
    socket.join(key);
}

const disconnectSocket = (app, io, socket, key) => {
    const channel = socket.id.split('#')[0];
    const { nickname, passport } = socket.request.session;
    const sessionId = socket.request.sessionID;
    const passportUser = passport ? passport.user : null;
    const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
    const auth = (passportUser && passportUser.username) ? true : false;

    //  delete mapping socket => gameId;
    const socketToKeyMap = app.get('socketToKey');
    socketToKeyMap.delete(socket.id);

    //  delete mapping socket => session
    const socketToSessionMap = app.get('socketToSession');
    socketToSessionMap.delete(socket.id);

    //  Broadcasting용 game 업데이트
    socket.leave(key);
}

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);

    app.set('counter', 0);
    app.set('canvas', new Map());
    app.set('chat', new Map());
    app.set('record', new Map());

    app.set('socketToSession', new Map());
    app.set('socketToKey', new Map());
    app.set('session', new Map());
    app.set('game', new Map());

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    //  subscribe 'Games' Namespace
    const games = io.of('/games');

    games.on('connect', socket => {
        console.dir('-------------socket(games)--------------');
        console.dir(socket.request.sessionID);
        const gameMap = app.get('game');
        
        socket.emit('message', {
            type: 'initialize',
            games: [...instanceSanitizer([...gameMap.values()])],
        });
        
        socket.on('disconnect', () => {
            console.dir('-------------socketDis(games)--------------');
            console.dir(socket.request.sessionID);
        })
    });


    //  subscribe 'Game' Namespace
    const game = io.of('/game');

    game.on('connect', socket => {
        console.dir('-------------socket(game)--------------');
        console.dir(socket.request.sessionID);
        
        //  game join & broadcast
        const key = socket.handshake.query['key'];
        if(!key) return;

        connectSocket(app, io, socket, key);

        const gameMap = app.get('game');
        const game = gameMap.get(key);
        const { nickname, passport } = socket.request.session;
        const passportUser = passport ? passport.user : null;
        const sessionId = socket.request.sessionID;
        const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
        const auth = (passportUser && passportUser.username) ? true : false;
        
        //  sessionId => key => socket
        const session = app.get('session');
        if(!session.has(sessionId)) {
            session.set(sessionId, new Map());
        }
        const sessionToKey = session.get(sessionId);
        if(!sessionToKey.has(key)) {
            sessionToKey.set(key, new Set());
        }
        const keyToSocket = sessionToKey.get(key);
        keyToSocket.add(socket);



        if(game._participant.has(sessionId)) {
            const socketSet = game._participant.get(sessionId);
            socketSet.add(socket.id);
        } else {
            //  first socket only serve
            if(!new Set(game.participant).has(username)) {
                game.participant.push(username);
            }
            game._participant.set(sessionId, new Set([socket.id]));

            const prior = game._priority;
            const subsequent = prior === 'white' ? 'black' : 'white';

            if(!game[prior] && !game[`_${prior}`] && !game[subsequent] && !game[`_${subsequent}`]) {
                game[prior] = username;
                game[`_${prior}`] = sessionId;
                game[`_${prior}Auth`] = auth;
            } else if(game[prior] && game[`_${prior}`] && game[`_${prior}`] !== sessionId && !game[subsequent] && !game[`_${subsequent}`]) {
                game[subsequent] = username;
                game[`_${subsequent}`] = sessionId;
                game[`_${subsequent}Auth`] = auth;
            }
        }

        game._ignite();
        game._broadcast();
        game._multicast();

        socket.on('disconnect', () => {
            disconnectSocket(app, io, socket, key);

            const session = app.get('session');
            const sessionId = socket.request.sessionID;

            if(session.has(sessionId)) {
                const sessionToKey = session.get(sessionId);
                if(sessionToKey.has(key)) {
                    const keyToSocket = sessionToKey.get(key);
                    sessionToKey.set(key,
                        new Set(
                            [...keyToSocket]
                            .filter(soc => soc.id !== socket.id)
                        )
                    );
                    if(sessionToKey.get(key).size === 0) {
                        sessionToKey.delete(key);
                    };
                }
                if(session.get(sessionId).size === 0) {
                    session.delete(sessionId);
                }
            }
            console.dir(session);
            
            

            const { nickname, passport } = socket.request.session;
            const passportUser = passport ? passport.user : null;
            const username = (passportUser && passportUser.username) ? passportUser.username : nickname;

            if(game._participant.has(sessionId)) {
                const socketSet = game._participant.get(sessionId);
                socketSet.delete(socket.id);
        
                if(socketSet.size === 0) {
                    game._participant.delete(sessionId);
        
                    const index = game.participant.findIndex(ele => ele === username);
        
                    if(index >= 0) {
                        game.participant.splice(index, 1);
                    };
                    
                    console.dir('games broadcast');
                    game._smother();
                    game._broadcast();
                    game._multicast();
                    
                }
            }
            
            console.dir('-------------socketDis(game)--------------');
            console.dir(socket.request.sessionID);
        })
    });


    //  subscribe 'Chat' Namespace
    const chat = io.of('/chat');

    chat.on('connect', socket => {
        console.dir('-------------socket(chat)--------------');
        console.dir(socket.request.sessionID);
        
        //  game join & broadcast
        const key = socket.handshake.query['key'];
        if(!key) return;

        connectSocket(app, io, socket, key);
        
        const { nickname, color } = socket.request.session;
        const socketToSessionMap = app.get('socketToSession');

        //  Broadcast only on the first session of a socket
        chat.in(key).clients((err, clients) => {
            let count = 0;
            clients.forEach(client => {
                if(socketToSessionMap.get(client) === socketToSessionMap.get(socket.id)) {
                    ++count;
                }
            });

            if(count === 1) {
                socket.broadcast.to(key).emit('message', {
                    type: 'change',
                    color,
                    message: `${nickname} join the game`,
                });
            }
        });
        
        //  Broadcast only to my socket
        socket.emit('message', {
            type: 'initialize',
            color,
            message: `welcome ${nickname}`,
        });

        socket.on('disconnect', () => {
            const socketToSessionMap = app.get('socketToSession');

            //  asynchronous function
            chat.in(key).clients((err, clients) => {
                let count = 0;
                clients.forEach(client => {
                    if(socketToSessionMap.get(client) === socketToSessionMap.get(socket.id)) {
                        ++count;
                    }
                });
    
                if(count === 0) {
                    socket.broadcast.to(key).emit('message', {
                        type: 'change',
                        color,
                        message: `${nickname} left the game`,
                    });
                }

                disconnectSocket(app, io, socket, key);
            });

            console.dir('-------------socketDis(chat)--------------');
            console.dir(socket.request.sessionID);
        })
    })

    //  subscribe 'Canvas' Namespace

    io.of('/canvas').on('connect', socket => {
        console.dir('-------------socket(canvas)--------------');
        console.dir(socket.request.sessionID);

        //  프론트쪽에 key 없는 접근 redirect하는 코드 넣어둘 것 (서버쪽에서 message를 보내면 좋을 듯)
        const key = socket.handshake.query['key'];
        if(!key) return;
       
        connectSocket(app, io, socket, key);

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
        });
        
        socket.on('disconnect', () => {
            disconnectSocket(app, io, socket, key);

            console.dir('-------------socketDis(canvas)--------------');
            console.dir(socket.request.sessionID);
        });
    });


    // subscribe 'Record' Namespace
    io.of('/record').on('connect', socket => {
        console.dir('-------------socket(record)--------------');
        console.dir(socket.request.sessionID);

        const key = socket.handshake.query['key'];
        if(!key) return;

        connectSocket(app, io, socket, key);

        const recordMap = app.get('record');
        if(!recordMap.has(key)) {
            const recordSkeleton = {
                startTime: null,
                endTime: null,
                blackTime: null,
                whiteTime: null,
                blackMaxTime: null,
                whiteMaxTime: null,
                blackRatio: null,
                whiteRatio: null,
                pieceMove: [],
                _setTimeRef: null,
                _initialize: function() {
                    const game = app.get('game').get(key);
                    this.blackTime = game.defaultTime;
                    this.whiteTime = game.defaultTime;
                    this.blackMaxTime = game.defaultTime;
                    this.whiteMaxTime = game.defaultTime;
                    this.blackRatio = 1;
                    this.whiteRatio = 1;
                },
                _start: function(order) {
                    this.startTime = new Date().getTime();
                    this._reduce(order);
                },
                _end: function(order) {
                    this.endTime = new Date().getTime();
                    console.dir(order + ' end');
                },
                _change: function() {
                    this._stop();
                    const game = app.get('game').get(key);
                    this._recharge(game.order === 'white' ? 'black': 'white');
                    this._start(game.order, true);
                },
                _stop: function() {
                    clearTimeout(this._setTimeRef);
                },
                _recharge: function(order) {
                    console.dir(`recharge ${order}`);

                    const game = app.get('game').get(key);
                    this[order + 'Time'] += game.extraTime;
                    this[order + 'MaxTime'] = Math.max(this[order + 'MaxTime'], this[order + 'Time']);
                    this[order + 'Ratio'] = this[order + 'Time'] / this[order + 'MaxTime'];
                    
                    this._broadcast({
                        type: 'change',
                        [order + 'Time']: this[order + 'Time'],
                        [order + 'MaxTime']: this[order + 'MaxTime'],
                        [order + 'Ratio']: this[order + 'Ratio'],
                    });
                    this._broadcast({
                        type: 'update',
                        pieceMove: this.pieceMove[this.pieceMove.length - 1],
                    });
                },
                _reduce: function(order) {
                    this._stop();
                    this._setTimeRef = setTimeout(() => {
                        this[order + 'Time'] -= 1000;
                        if(this[order + 'Time'] >= 0) {
                            this[order + 'Ratio'] = this[order + 'Time'] / this[order + 'MaxTime'];
                            this._broadcast({
                                type: 'change',
                                [order + 'Time']: this[order + 'Time'],
                                [order + 'Ratio']: this[order + 'Ratio'],
                            });    
                            this._reduce(order);
                        } else {
                            this[order + 'Time'] = 0;
                            this._end(order);
                        }
                    }, 1000);
                },
                _broadcast: function(message) {
                    io.of('/record').to(key).emit('message', message);
                },
                _unicast: function(socket) {
                    socket.emit('message', {
                        type: 'initialize',
                        ...instanceSanitizer(this),
                    })
                },
            };

            recordSkeleton._initialize();
            app.get('game').get(key)._record = recordSkeleton;
            app.get('record').set(key, recordSkeleton);
        }

        const record = app.get('record').get(key);
        record._unicast(socket);

        socket.on('disconnect', () => {
            disconnectSocket(app, io, socket, key);
            
            console.dir('-------------socketDis(record)--------------')
            console.dir(socket.request.sessionID);
        })
    });

    // subscribe 'sessionAuth' Namespace
    const sessionAuth = io.of('/sessionAuth');
    sessionAuth.on('connect', socket => {
        console.dir('-------------socket(sessionAuth)--------------');
        console.dir(socket.request.sessionID);

        const { passport } = socket.request.session;
        const passportUser = passport ? passport.user : null;
        
        //  Session based service
        socket.join(socket.request.sessionID);

        if(passportUser) {
            socket.emit('message', {
                type: 'initialize',
                ...passportUser,
            });
        };
        
        socket.on('disconnect', () => {
            socket.leave(socket.request.sessionID);

            console.dir('-------------socketDis(sessionAuth)--------------');
            console.dir(socket.request.sessionID);
        })
    });

    // subscribe 'socketAuth' Namespace
    const socketAuth = io.of('/socketAuth');
    socketAuth.on('connect', socket => {      
        //  io connection시에는 sessionID가 다르지만, 첫 http request 이후 세션 고정
        //  socket과 http request가 동일한 세션을 공유할 수 있음
        
        console.dir('-------------socket(socketAuth)--------------');
        console.dir(socket.request.sessionID);

        const key = socket.handshake.query['key'];
        if(!key) return;

        connectSocket(app, io, socket, key);

        const { nickname, color, passport } = socket.request.session;
        const passportUser = passport ? passport.user : null;
        const username = (passportUser && passportUser.username) ? passportUser.username : nickname;

        if(!nickname) return;

        const sessionId = socket.request.sessionID;
        const game = app.get('game').get(key);
        if(!game) return;

        const role = (game._black === sessionId && game.black === username) ? 'black': ((game._white === sessionId && game.white === username)? 'white' : 'spectator');
        
        console.dir(game._black === sessionId);
        console.dir(game.black === username);
        console.dir(username);
        socket.emit('message', {
            type: 'initialize',
            nickname,
            role,
            color,
        });


        // socket.on('message', () => {
        //     console.dir('-------------serveronMessage--------------')
        //     console.dir(socket.request.sessionID);
        // });

        socket.on('disconnect', () => {
            disconnectSocket(app, io, socket, key);
            console.dir('-------------socketDis(socketAuth)--------------')
            console.dir(socket.request.sessionID);
        })
    })

};