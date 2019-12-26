//  세션에 해당하는 소켓 객체를 mapper를 이용해 가져다 쓸 수 있다
// const { mapSessionToSocket } = req.app.get('mapper');
// const socket = mapSessionToSocket.get(req.session.id);

import uuid from 'uuid/v1';

export const createRoom = (req, res, next) => {
    const io = req.app.get('io');
    const roomMap = req.app.get('room');
    const size = roomMap.size;

    const genRoom = {
        key: uuid(),
        name: `room${size}`,
        turn: 0,
        order: 'white',
        participant: [],
        black: null,
        white: null,
        method: 'timeAttack',
        defaultTime: 60000,
        rechargeTime: 10000,
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
            roomMap.delete(this.key);
        },
    }

    roomMap.set(genRoom.key, genRoom);

    //  change 이벤트로 바꿔야 함
    //  change에서는 room 객체 정보만 전달하자
    io.of('/room').emit('message', {
        type: 'initialize',
        room: [...roomMap.values()],
    });

    res.send(genRoom.key);
    res.status(202).end();
}

export const deleteRoom = (req, res, next) => {
    
    const room = {
        //  지우려는 방의 기존과 동일한 uuid,
    }

    io.of('/room').emit('message', {
        type: 'change',
        room,
    });

    res.send();
    res.status(202).end();
}