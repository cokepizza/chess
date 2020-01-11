//  세션에 해당하는 소켓 객체를 mapper를 이용해 가져다 쓸 수 있다
// const { mapSessionToSocket } = req.app.get('mapper');
// const socket = mapSessionToSocket.get(req.session.id);

import uuid from 'uuid/v1';

export const createGame = (req, res, next) => {
    const io = req.app.get('io');
    const gameMap = req.app.get('game');
    const size = gameMap.size;

    const genGame = {
        key: uuid(),
        name: `game${size}`,
        turn: 0,
        order: 'white',
        participant: [],
        black: null,
        white: null,
        method: 'timeAttack',
        defaultTime: 50000,
        rechargeTime: 5000,
        start: false,
        // _startTime: null,
        // _repTime: null,
        // _start: function () {
        //     this.start = true;
        //     this._startTime = new Date().getTime();
        //     this._repTime = this._startTime;
        //     this._broadcastTime();
        // },
        // _boradcastTime: function() {
        //     // const record = app.get('record').get(key);
            
        //     io.of('/record').emit('message', {
        //         type: 'initialize',
        //         time: {
        //             black: this.blackTime,
        //             white: this.whiteTime,
        //         }
        //     });
        // },
        _participant: new Map(),
        _black: null,
        _white: null,
        _destroy: function() {
            gameMap.delete(this.key);
        },
    }

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

    io.of('/game').emit('message', {
        type: 'change',
        game,
    });
    
    io.of('/games').emit('message', {
        type: 'initialize',
        games: [...gameMap.values()],
    });

    return res.status(202).end();
}