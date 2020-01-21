//  세션에 해당하는 소켓 객체를 mapper를 이용해 가져다 쓸 수 있다
// const { mapSessionToSocket } = req.app.get('mapper');
// const socket = mapSessionToSocket.get(req.session.id);

import uuid from 'uuid/v1';
import Game from '../../models/game';
import User from '../../models/user';

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
        _room: null,
        _join: function(socket) {
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
        _ignite: function() {
            if(this.mode === 'rank') {

            }
        },
        _save: async function() {
            if(this._draw && (!this.white || !this.black)) return;
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

            const pieceMove = JSON.stringify(this._room.pieceMove);
            
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
            });

            if(this._draw) {
                winner.game.draw.push(game._id);
                winner.draw += 1;
                loser.game.draw.push(game._id);
                loser.draw += 1;
            } else {
                winner.game.win.push(game._id);
                winner.win += 1;
                loser.game.lose.push(game._id);
                loser.lose += 1;
            }
            
            await Promise.all([ game.save(), winner.save(), loser.save() ]);

            const rec = await Game.findOne({
                "player.0": winner._id,
            }).populate('player');

            console.dir('-------------------');
            console.dir(rec.toString());
            // console.dir('-------------------');
            // console.dir(rec.toJSON());
        },
        _destroy: async function() {
            console.dir('_destroy');
            if(this.mode === 'rank') {
                await this._save();
            }
            console.dir('_destory_end');
            
            gameMap.delete(this.key);

            io.of('/games').emit('message', {
                type: 'initialize',
                games: [...gameMap.values()],
            });
        },
    };

    gameMap.set(genGame.key, genGame);

    //  change 이벤트로 바꿔야 함
    //  change에서는 game 객체 정보만 전달하자
    io.of('/games').emit('message', {
        type: 'initialize',
        games: [...gameMap.values()],
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
        games: [...gameMap.values()],
    });

    return res.status(202).end();
}