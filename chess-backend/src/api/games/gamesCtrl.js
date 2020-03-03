//  세션에 해당하는 소켓 객체를 mapper를 이용해 가져다 쓸 수 있다
// const { mapSessionToSocket } = req.app.get('mapper');
// const socket = mapSessionToSocket.get(req.session.id);

import uuid from 'uuid/v1';

import Game from '../../models/game';
import User from '../../models/user';
import instanceSanitizer from '../../lib/util/instanceSanitizer';
import { getRatio } from '../../cache';

export const createGame = (req, res, next) => {
    const io = req.app.get('io');
    const gameMap = req.app.get('game');
    const size = gameMap.size;
    const { map, mode, defaultTime, extraTime, piece } = req.body;
    
    const genGame = {
        key: uuid(),
        name: `game${size}`,
        turn: 0,
        order: 'white',
        participant: [],
        black: null,
        white: null,
        map: map.toLowerCase(),
        mode: mode.toLowerCase(),
        defaultTime: defaultTime * 60000,
        extraTime: extraTime * 1000,
        createdAt: new Date(),
        destroyAt: null,
        start: false,
        _init: false,
        _priority: piece,
        _participant: new Map(),
        _black: null,
        _white: null,
        _blackAuth: false,
        _whiteAuth: false,
        _reasonType: null,
        _reasonMessage: null,
        _draw: false,
        _winner: null,
        _loser: null,
        _record: null,
        _socketAuth: null,
        _join: function(socket) {
            //  도입 예정
            const sessionId = socket.request.sessionID;
            const { nickname, passport } = socket.request.session;
            const passportUser = passport ? passport.user : null;
            const authname = (passportUser && passportUser.username) ? passportUser.username : nickname;
            const auth = (passportUser && passportUser.username) ? true : false;

            if(this._participant.has(sessionId)) {
                //  duplicate session
                const socketSet = this._participant.get(sessionId);
                socketSet.add(socket.id);
            } else {
                //  initialize session (enter this._participant, this.participant)
                this._participant.set(sessionId, new Set([ socket.id ]));
                // if(new Set(this.participant).has())
            }
        },
        _heartbeat: function() {
            const participantSet = new Set(this.participant);
            if(!this.start && this.white && participantSet.has(this.white) && this.black && participantSet.has(this.black)) {
                this._init = true;
                this.start = true;
                this._record._start(this.order);
                
                console.dir('heartbeat run again');
            } else if(this.start && ((this.white && !participantSet.has(this.white)) || (this.black && !participantSet.has(this.black)))) {
                this.start = false;
                this._record._stop();
                
                //  Util modal Request(asking, answering) acting 제어
                this._record.blocked = false;
                this._record._asking = false;
                this._record._answering = false;

                //  Util Modal UI 업데이트 중단
                clearTimeout(this._record._setTimeRequestMessageRef['undo']);
                clearTimeout(this._record._setTimeRequestMessageRef['draw']);
                clearTimeout(this._record._setTimeRequestMessageRef['surrender']);
                clearTimeout(this._record._setTimeRequestCloseRef['undo']);
                clearTimeout(this._record._setTimeRequestCloseRef['draw']);
                clearTimeout(this._record._setTimeRequestCloseRef['surrender']);

                console.dir('heartbeat cool off');
            }
            this._broadcast();
            this._multicast();
        },
        _broadcast: function() {
            io.of('/game').to(this.key).emit('message', {
                type: 'initialize',
                ...instanceSanitizer(this),
            });
        },
        _multicast: function() {
            const gameMap = req.app.get('game');
            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...instanceSanitizer([...gameMap.values()])],
            });
        },
        _save: async function() {
            if(!this._draw && (!this._winner || !this._loser)) return;
            if(!this._blackAuth || !this._whiteAuth) return;

            let promiseArr = [];
            if(this._draw) {
                promiseArr.push(User.findOne({ username: this.white }));
                promiseArr.push(User.findOne({ username: this.black }));
            } else {
                promiseArr.push(User.findOne({ username: this._winner }));
                promiseArr.push(User.findOne({ username: this._loser }));
            }
            const [ winner, loser ] = await Promise.all(promiseArr);

            const pieceMove = JSON.stringify(this._record.pieceMove);
            
            const game = new Game({
                player: [ winner._id, loser._id ],
                draw: this._draw,
                name: this.name,
                turn: this.turn,
                map: this.map,
                mode: this.mode,
                defaultTime: this.defaultTime,
                extraTime: this.extraTime,
                reasonType: this._reasonType,
                reasonMessage: this._reasonMessage,
                pieceMove,
                createdAt: this.createdAt,
                destroyAt: new Date(),
            });

            const winnerBeforeSnapshot = {
                ...winner.toJSON(),
                ratio: getRatio(winner.toJSON()).ratio,
            };
            const loserBeforeSnapshot = {
                ...loser.toJSON(),
                ratio: getRatio(loser.toJSON()).ratio,
            };

            if(this._draw) {
                winner.game.draw.push(game._id);
                winner.draw += 1;
                loser.game.draw.push(game._id);
                loser.draw += 1;
            } else {
                winner.game.win.push(game._id);
                winner.win += 1;
                winner.setElo(1, loser.elo);
                loser.game.lose.push(game._id);
                loser.lose += 1;
                loser.setElo(0, winner.elo);
            }

            const winnerAfterSnapshot =  {
                ...winner.toJSON(),
                ratio: getRatio(winner.toJSON()).ratio,
            };
            const loserAfterSnapshot = {
                ...loser.toJSON(),
                ratio: getRatio(loser.toJSON()).ratio,
            };
            
            await Promise.all([ game.save(), winner.save(), loser.save() ]);

            //  memory caching
            if(!this.draw) {
                console.dir(winner.toJSON());
                const ranking = req.app.get('ranking');
                // ranking._register({
                //     winner: {
                //         ...winner.toJSON(),
                //         ratio: getRatio(winner.toJSON()).ratio,
                //     },
                //     loser: {
                //         ...loser.toJSON(),
                //         ratio: getRatio(loser.toJSON()).ratio,
                //     }
                // });
                ranking._register({
                    winnerBefore: winnerBeforeSnapshot,
                    loserBefore: loserBeforeSnapshot,
                    winnerAfter: winnerAfterSnapshot,
                    loserAfter: loserAfterSnapshot,
                });
                ranking._broadcast();
            }
        },
        _destroy: async function(snapshot) {
            //  stop current game
            this.participant = [];
            this._participant = new Map();
            this._heartbeat();

            //  get game stat
            if(snapshot) {
                snapshot.draw && (this._draw = true);
                snapshot.winner && (this._winner = snapshot.winner);
                snapshot.loser && (this._loser = snapshot.loser);
            }

            let saveFlag = false;
            if(this.mode === 'rank') {
                try {
                    await this._save();
                    saveFlag = true;
                    console.dir('save complete');
                } catch(e) {
                    console.dir(e);
                    console.dir('save error emerge');
                }
            }
            
            let message;
            if(this._draw) {
                message = `Nobody won the game.` + (saveFlag ? ' Game saved' : '');
            } else {
                message = `Player ${this._winner} won the game.` + (saveFlag ? ' Game saved' : '');
            }

            io.of('/chat').to(this.key).emit('message', {
                type: 'change',
                message,
            });

            gameMap.delete(this.key);

            console.dir(`${this.key} Game destroy`);
            
            io.of('/chat').to(this.key).emit('message', {
                type: 'change',
                message: 'Game is over',
            });

            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...instanceSanitizer([...gameMap.values()])],
            });
        },
    };

    gameMap.set(genGame.key, genGame);

    //  change 이벤트로 바꿔야 함
    //  change에서는 game 객체 정보만 전달하자
    io.of('/games').emit('message', {
        type: 'initialize',
        games: [...instanceSanitizer([...gameMap.values()])],
    });

    return res.status(202).send(genGame.key);
}

export const deleteGame = (req, res, next) => {
    
    const game = {
        //  지우려는 방의 기존과 동일한 uuid,
    }

    // io.of('/game').emit('message', {
    //     type: 'change',
    //     game,
    // });
    
    io.of('/games').emit('message', {
        type: 'initialize',
        games: [...instanceSanitizer([...gameMap.values()])],
    });

    return res.status(202).end();
}