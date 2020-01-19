import SocketIO from 'socket.io';
import _ from 'lodash';

import defaultBoard from './lib/base/board';
import instanceSanitizer from './lib/util/instanceSanitizer';

const connectGame = (app, io, socket, key) => {
    const channel = socket.id.split('#')[0];
    const { nickname, passport } = socket.request.session;
    const sessionId = socket.request.sessionID;
    const passportUser = passport ? passport.user : null;
    const username = (passportUser && passportUser.username) ? passportUser.username : nickname;

    //  mapping socket => gameId
    const socketToGameMap = app.get('socketToGame');
    socketToGameMap.set(socket.id, key);
    
    //  mapping socket => session
    const socketToSessionMap = app.get('socketToSession');
    socketToSessionMap.set(socket.id, socket.request.sessionID);

    //  Game(key) based service
    socket.join(key);

    //  Server용 game 객체 업데이트
    const gameMap = app.get('game');
    const game = gameMap.get(key);

    //  프론트쪽에 game 없는 접근 redirect하는 코드 넣어둘 것
    if(!game) return;

    if(channel === '/socketAuth') {
        if(game._participant.has(sessionId)) {
            const socketSet = game._participant.get(sessionId);
            socketSet.add(socket.id);
        } else {
            //  first socket only serve
            if(!new Set(game.participant).has(username)) {
                game.participant.push(username);
            }
            game._participant.set(sessionId, new Set([socket.id]));

            //  Grab the opposite piece when the second player arrives
            if(!game._white && game._black !== sessionId) {
                game.white = username;
                game._white = sessionId;
            }
            if(!game._black && game._white !== sessionId) {
                game.black = username;
                game._black = sessionId;
            }

            //  Set game creator's username
            if(game._white && game._white === sessionId) {
                game.white = username;
            }
            if(game._black && game._black === sessionId) {
                game.black = username;
            }
    
            if(game._white && game._black) {
                if(sessionId === game._white || sessionId === game._black) {
                    if(game._participant.has(game._white) && game._participant.has(game._black)) {
                        const record = app.get('record').get(key);
                        record._start(game.order);
                        game.start = true;
                    };
                }
            }
            
            io.of('/game').to(key).emit('message', {
                type: 'initialize',
                ...instanceSanitizer(game),
            });
    
            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...gameMap.values()],
            });
        }
    }
    console.dir(game);
}

const disconnectGame = (app, io, socket, key) => {
    const channel = socket.id.split('#')[0];
    const { nickname, passport } = socket.request.session;
    const sessionId = socket.request.sessionID;
    const passportUser = passport ? passport.user : null;
    const username = (passportUser && passportUser.username) ? passportUser.username : nickname;

    //  delete mapping socket => gameId;
    const socketToGameMap = app.get('socketToGame');
    socketToGameMap.delete(socket.id);

    //  delete mapping socket => session
    const socketToSessionMap = app.get('socketToSession');
    socketToSessionMap.delete(socket.id);

    //  Broadcasting용 game 업데이트
    socket.leave(key);

    //  Server용 game 객체 업데이트
    const gameMap = app.get('game');
    const game = gameMap.get(key);

    //  프론트쪽에 game 없는 접근 redirect하는 코드 넣어둘 것
    if(!game) return;

    if(channel === '/socketAuth') {
        if(game._participant.has(sessionId)) {
            const socketSet = game._participant.get(sessionId);
            socketSet.delete(socket.id);

            if(socketSet.size === 0) {
                game._participant.delete(sessionId);

                const index = game.participant.findIndex(ele => ele === username);
                if(index >= 0) {
                    game.participant.splice(index, 1);
                };
                
                if(game._black === sessionId || game._white === sessionId) {
                    const record = app.get('record').get(key);
                    record._stop();
                    game.start = false;

                    //  나가면 5초내에 재접속이 없을 시 게임 종료
                    
                };

                io.of('/game').to(key).emit('message', {
                    type: 'initialize',
                    ...instanceSanitizer(game),
                });

                io.of('/games').emit('message', {
                    type: 'initialize',
                    games: [...gameMap.values()],
                });
                
                //  나가는 선택권은 프론트에 주어져야 할 듯
                // if(game._start && (game._black === null || game._white === null)) {
                //     game._destory();
                // }
            }
        } else {
            
        }
    }
}

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);

    app.set('counter', 0);
    app.set('canvas', new Map());
    app.set('chat', new Map());
    app.set('record', new Map());

    app.set('socketToSession', new Map());
    app.set('socketToGame', new Map());
    app.set('game', new Map());

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    //  subscribe 'Games' Namespace
    const games = io.of('/games');

    games.on('connect', socket => {
        console.dir('-------------socket(games)--------------');
        console.dir(socket.request.sessionID);
        const game = app.get('game');
        
        socket.emit('message', {
            type: 'initialize',
            games: [...game.values()],
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

        connectGame(app, io, socket, key);

        const game = app.get('game').get(key);

        socket.emit('message', {
            type: 'initialize',
            ...game,
        });

        socket.on('disconnect', () => {
            disconnectGame(app, io, socket, key);

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

        connectGame(app, io, socket, key);
        
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

                disconnectGame(app, io, socket, key);
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
       
        connectGame(app, io, socket, key);

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
            disconnectGame(app, io, socket, key);

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

        connectGame(app, io, socket, key);

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
            app.get('game').get(key)._room = recordSkeleton;
            app.get('record').set(key, recordSkeleton);
        }

        const record = app.get('record').get(key);
        record._unicast(socket);

        socket.on('disconnect', () => {
            disconnectGame(app, io, socket, key);
            
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
        }
        
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

        connectGame(app, io, socket, key);

        const { nickname, color } = socket.request.session;
        if(!nickname) return;

        const sessionId = socket.request.sessionID;
        const game = app.get('game').get(key);
        if(!game) return;

        const role = game._black === sessionId ? 'black': (game._white === sessionId ? 'white' : 'spectator');
        
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
            disconnectGame(app, io, socket, key);
            console.dir('-------------socketDis(socketAuth)--------------')
            console.dir(socket.request.sessionID);
        })
    })

};