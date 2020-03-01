import SocketIO from 'socket.io';
import _ from 'lodash';

import defaultBoard from './lib/base/board';
import instanceSanitizer from './lib/util/instanceSanitizer';
import registerCache from './registerCache';

//  socket connection for gameplay
const requiredNameSpace = 5;
const connectSocket = (app, socket, key, tabKey, initialize) => {
    //  initialization proceeds when all necessary sockets are connected (sockets => 5)
    //  tabKey => channel => { socket, initialize }
    const channel = socket.id.split('#')[0];
    const socketMap = app.get('socket');
    if(!socketMap.has(tabKey)) {
        socketMap.set(tabKey, new Map());
    };
    
    const socketKeyMap = socketMap.get(tabKey);
    if(!socketKeyMap.has(channel)) {
        socketKeyMap.set(channel, {
            socket,
            initialize,
        });
    }

    //  namespace간에 connection 단계에서 dependency가 있는 로직이 있기 때문에 (socketAuth와 game 채널에서)
    //  객체 매핑 & 게임 초기화 단계와 그 다음 처리 로직을 순차적으로 구분하였다

    //  connection 단계 => initialize 단계 => disconnection 단계 => cleanup 단계로 나눠볼 수 있다
    //  connection 단계에서는 namespace 객체간 매핑 및 초기 게임 정보를 세팅한다
    //  initialize 단계에서는 객체 매핑이나 초기 게임 정보가 삽입된 후 필요한 처리가 들어간다 (각 initialize함수는 dependency가 있어서는 안된다)
    //  disconnection 단계에서는 각 namespace들이 종료된다
    //  cleanup 단계에서는 socket의 namespace가 모두 끊긴 직후, 즉 마지막 namespace가 종료를 원할떄 각 namespace에서 필요한 코드가 실행된다
    //  각 단계는 순차적으로 진행되며 직전단계까지의 완료가 보장된다

    if(socketKeyMap.size % requiredNameSpace === 0) {
        [...socketKeyMap.values()].forEach(obj => {
            const cleanup = obj.initialize && obj.initialize();
            if(cleanup) {
                socketKeyMap.set(channel, {
                    ...socketKeyMap.get(channel),
                    cleanup,
                });
            }
        });
    }


    //  sessionId => gameKey => channel => socket
    const sessionToKey = app.get('session');
    const sessionId = socket.request.sessionID;
    if(!sessionToKey.has(sessionId)) {
        sessionToKey.set(sessionId, new Map());
    }
    const keyToChannel = sessionToKey.get(sessionId);
    if(!keyToChannel.has(key)) {
        keyToChannel.set(key, new Map());
    }
    const channelToSocket = keyToChannel.get(key);
    if(!channelToSocket.has(channel)) {
        channelToSocket.set(channel, new Set());
    }
    const socketSet = channelToSocket.get(channel);
    socketSet.add(socket);

    //  mapping socket => gameId
    const socketToKeyMap = app.get('socketToKey');
    socketToKeyMap.set(socket.id, key);
    
    //  mapping socket => session
    const socketToSessionMap = app.get('socketToSession');
    socketToSessionMap.set(socket.id, socket.request.sessionID);

    //  Game(key) based service
    socket.join(key);
}

const disconnectSocket = (app, socket, key, tabKey) => {
    //  disconnect socket information for each channel
    const channel = socket.id.split('#')[0];
    const socketMap = app.get('socket');
    if(socketMap.has(tabKey)) {
        const socketKeyMap = socketMap.get(tabKey);
        if(socketKeyMap.has(channel)) {
            const obj = socketKeyMap.get(channel);
            if(obj.cleanup) {
                if(!socketMap.has(`${tabKey}_cleanup`)) {
                    socketMap.set(`${tabKey}_cleanup`, [ obj.cleanup ]);
                } else {
                    socketMap.set(`${tabKey}_cleanup`,
                        [ ...socketMap.get(`${tabKey}_cleanup`), obj.cleanup ]
                    );
                };
            };
                
            socketKeyMap.delete(channel);
        }
        if(socketKeyMap.size === 0) {
            if(socketMap.has(`${tabKey}_cleanup`)) {
                socketMap.get(`${tabKey}_cleanup`).forEach(cleanup => cleanup());
                socketMap.delete(`${tabKey}_cleanup`);
            }
            
            socketMap.delete(tabKey);
        }
    };

    //  delete mapping sessionId => gameKey => channel => socket
    const sessionToKey = app.get('session');
    const sessionId = socket.request.sessionID;
    if(sessionToKey.has(sessionId)) {
        const keyToChannel = sessionToKey.get(sessionId);
        if(keyToChannel.has(key)) {
            const channelToSocket = keyToChannel.get(key);
            if(channelToSocket.has(channel)) {
                const socketSet = channelToSocket.get(channel);
                channelToSocket.set(channel, 
                    new Set(
                        [...socketSet]
                        .filter(soc => soc.id !== socket.id)
                    )
                );
                if(channelToSocket.get(channel).size === 0) {
                    channelToSocket.delete(channel);
                };
            }
            if(keyToChannel.get(key).size === 0) {
                keyToChannel.delete(key);
            };
        }
        if(sessionToKey.get(sessionId).size === 0) {
            sessionToKey.delete(sessionId);
        }
    }

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
    app.set('socketAuth', new Map());

    app.set('socketToSession', new Map());
    app.set('socketToKey', new Map());
    app.set('session', new Map());
    app.set('socket', new Map());
    app.set('game', new Map());

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    
    registerCache(app);

    //  subscribe 'BillBoard' Namespace
    io.of('/billBoard').on('connect', socket => {
        console.dir('-------------socket(billBoard)--------------');
        console.dir(socket.request.sessionID);

        // const key = socket.handshake.query['roomKey'];
        // if(!key) return;
        
        const billBoard = app.get('billBoard');
        
        for(let key = 0; key <4; ++key) {
            if(billBoard[key]) {
                const inform = billBoard[key].player.map(player => ({
                    username: player.username,
                    elo: player.elo,
                }));
    
                socket.emit('message', {
                    type: 'initialize',
                    roomKey: key,
                    inform,
                    board: billBoard[key].board,
                });
        
                billBoard[key].participant.push(socket);
            }
        }
        
        socket.on('disconnect', () => {
            console.dir('-------------socketDis(billBoard)--------------');
            console.dir(socket.request.sessionID);

            for(let key = 0; key <4; ++key) {
                if(billBoard[key]) {
                    const index = billBoard[key].participant.findIndex(soc => soc.id === socket.id);
                    billBoard[key].participant.splice(index, 1);
                }
            }
        });
    });

    //  subscribe 'Ranking' Namespace
    io.of('/ranking').on('connect', socket => {
        console.dir('-------------socket(ranking)--------------');
        console.dir(socket.request.sessionID);
        
        const ranking = app.get('ranking');
        ranking._unicast(socket);

        // test
        // setTimeout(() => {
        //     const copiedRanking = JSON.parse(JSON.stringify(ranking.list.slice(0, 15)));
        //     const wait = copiedRanking[0];
        //     copiedRanking[0] = copiedRanking[5];
        //     copiedRanking[5] = wait;
        //     copiedRanking.splice(6, 1, {
        //         username: 'hahah@yahoo.com',
        //         elo: 1600,
        //         win: 500,
        //         lose: 300,
        //         ratio: '37',
        //         index: 6,
        //     });

        //     socket.emit('message', {
        //         type: 'initialize',
        //         ranking: copiedRanking,
        //     });
        // }, 1000);

        socket.on('disconnect', () => {
            console.dir('-------------socketDis(ranking)--------------');
            console.dir(socket.request.sessionID);
        });
    });


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

        const key = socket.handshake.query['gameKey'];
        const tabKey = socket.handshake.query['tabKey'];
        if(!key) return;

        const gameMap = app.get('game');
        if(!gameMap.has(key)) return;

        const game = gameMap.get(key);

        const sessionId = socket.request.sessionID;
        const { nickname, passport } = socket.request.session;
        const passportUser = passport ? passport.user : null;
        const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
        const auth = (passportUser && passportUser.username) ? true : false;

        //  game._join
        if(game._participant.has(sessionId)) {
            //  duplicate session
            const socketSet = game._participant.get(sessionId);
            socketSet.add(socket.id);
        } else {
            //  initialize session (enter _participant, participant)
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

        const initialize = () => {
            game._heartbeat();
            //  clean up function
            return () => {
                const game = app.get('game').get(key);
                if(game) {
                    game._heartbeat();
                }
            }
        }
        
        connectSocket(app, socket, key, tabKey, initialize);
        
        socket.on('disconnect', () => {
            
            const sessionId = socket.request.sessionID;
            const { nickname, passport } = socket.request.session;
            const passportUser = passport ? passport.user : null;
            const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
            const game = app.get('game').get(key);

            //  game._leave
            if(game) {
                if(game._participant.has(sessionId)) {
                    const socketSet = game._participant.get(sessionId);
                    socketSet.delete(socket.id);
            
                    if(socketSet.size === 0) {
                        game._participant.delete(sessionId);
            
                        const index = game.participant.findIndex(ele => ele === username);
            
                        if(index >= 0) {
                            game.participant.splice(index, 1);
                        };
                    }
                }
            }

            disconnectSocket(app, socket, key, tabKey);
            
            if(game) {
                const participantSet = new Set(game.participant);
                if(game._init && (!participantSet.has(game.white) || !participantSet.has(game.black))) {
                    if(!participantSet.has(game.white)) {
                        game._destroy({
                            draw: false,
                            winner: game.black,
                            loser: game.white,
                        });
                    }
                    if(!participantSet.has(game.black)) {
                        game._destroy({
                            draw: false,
                            winner: game.white,
                            loser: game.black,
                        });
                    }
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

        const key = socket.handshake.query['gameKey'];
        const tabKey = socket.handshake.query['tabKey'];
        if(!key) return;

        const gameMap = app.get('game');
        if(!gameMap.has(key)) return;

        connectSocket(app, socket, key, tabKey);
        
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

                disconnectSocket(app, socket, key, tabKey);

                console.dir('-------------socketDis(chat)--------------');
                console.dir(socket.request.sessionID);
            });        
        })
    })

    //  subscribe 'Canvas' Namespace

    io.of('/canvas').on('connect', socket => {
        console.dir('-------------socket(canvas)--------------');
        console.dir(socket.request.sessionID);
       
        const key = socket.handshake.query['gameKey'];
        const tabKey = socket.handshake.query['tabKey'];
        if(!key) return;

        const gameMap = app.get('game');
        if(!gameMap.has(key)) return;

        connectSocket(app, socket, key, tabKey);

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
            disconnectSocket(app, socket, key, tabKey);

            console.dir('-------------socketDis(canvas)--------------');
            console.dir(socket.request.sessionID);
        });
    });


    // subscribe 'Record' Namespace
    io.of('/record').on('connect', socket => {
        console.dir('-------------socket(record)--------------');
        console.dir(socket.request.sessionID);

        const key = socket.handshake.query['gameKey'];
        const tabKey = socket.handshake.query['tabKey'];
        if(!key) return;

        const gameMap = app.get('game');
        if(!gameMap.has(key)) return;

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
                blocked: false,
                _asking: false,
                _answering: false,
                _setTimeRef: null,
                _setTimeRequestMessageRef: {},
                _setTimeRequestCloseRef: {},
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
                _modalOpen: function({ sender, receiver, genre }) {
                    const game = app.get('game').get(key);
                    if(!game.start) return;

                    const senderSocket = app.get('session').get(game[`_${sender}`]).get(key).get('/record');
                    const receiverSocket = app.get('session').get(game[`_${receiver}`]).get(key).get('/record');
                    
                    game._record.blocked = true;

                    [ ...senderSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            genre,
                            modal: 'ask',
                            open: true,
                        })
                    }); 
                    [ ...receiverSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            genre,
                            modal: 'answer',
                            open: true,
                        })
                    }); 
                },
                _modalMessage: function({ sender, receiver, genre, message }) {
                    const game = app.get('game').get(key);
                    if(!game.start) return;

                    const senderSocket = app.get('session').get(game[`_${sender}`]).get(key).get('/record');
                    const receiverSocket = app.get('session').get(game[`_${receiver}`]).get(key).get('/record');
                   
                    [ ...senderSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            genre,
                            open: true,
                            message: 'delivered',
                        })
                    }); 
                    [ ...receiverSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            genre,
                            open: true,
                            message,
                        })
                    });    
                },
                _modalClose: function({ sender, receiver }) {
                    const game = app.get('game').get(key);
                    if(!game.start) return;

                    const senderSocket = app.get('session').get(game[`_${sender}`]).get(key).get('/record');
                    const receiverSocket = app.get('session').get(game[`_${receiver}`]).get(key).get('/record');

                    game._record.blocked = false;

                    [ ...senderSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            open: false,
                        })
                    }); 
                    [ ...receiverSocket ].forEach(socket => {
                        socket.emit('message', {
                            type: 'notify',
                            open: false,
                        })
                    }); 
                }
            };

            recordSkeleton._initialize();
            app.get('game').get(key)._record = recordSkeleton;
            app.get('record').set(key, recordSkeleton);
        }

        const record = app.get('record').get(key);
        record._unicast(socket);

        connectSocket(app, socket, key, tabKey);

        socket.on('disconnect', () => {
            disconnectSocket(app, socket, key, tabKey);
            
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

        const key = socket.handshake.query['gameKey'];
        const tabKey = socket.handshake.query['tabKey'];
        if(!key) return;

        const game = app.get('game').get(key);
        if(!game) return;

        const socketAuthMap = app.get('socketAuth');
        if(!socketAuthMap.has(key)) {
            const socketAuthSkeleton = {
                role: null,
                nickname: null,
                color: null,
                _initialize: function(socket) {
                    const { nickname, color, passport } = socket.request.session;
                    const passportUser = passport ? passport.user : null;
                    const username = (passportUser && passportUser.username) ? passportUser.username : nickname;
                    const sessionId = socket.request.sessionID;
                    const game = app.get('game').get(key);

                    this.role = (game._black === sessionId && game.black === username) ? 'black': ((game._white === sessionId && game.white === username)? 'white' : 'spectator');
                    this.nickname = nickname;
                    this.color = color;
                },
                _unicast: function(socket) {
                    socket.emit('message', {
                        type: 'initialize',
                        ...instanceSanitizer(this),
                    });
                },
            }

            app.get('game').get(key)._socketAuth = socketAuthSkeleton;
            app.get('socketAuth').set(key, socketAuthSkeleton);
        }

        const initialize = () => {        
            const game = app.get('game').get(key);
            game._socketAuth._initialize(socket);
            game._socketAuth._unicast(socket);
        }

        connectSocket(app, socket, key, tabKey, initialize);

        socket.on('disconnect', () => {
            disconnectSocket(app, socket, key, tabKey);

            console.dir('-------------socketDis(socketAuth)--------------')
            console.dir(socket.request.sessionID);
        })
    })
};