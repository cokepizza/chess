//  세션에 해당하는 소켓 객체를 mapper를 이용해 가져다 쓸 수 있다
// const { mapSessionToSocket } = req.app.get('mapper');
// const socket = mapSessionToSocket.get(req.session.id);
import uuid from 'uuid/v1';

export const createRoom = (req, res, next) => {
    const io = req.app.get('io');

    const room = req.app.get('room');
    const length = room.length;

    const { nickname } = req.session;

    room.push({
        key: uuid(),
        name: `room${length}`,
        participant: [nickname],
    });

    io.of('/room').emit('message', {
        type: 'initialize',
        room,
    });

    res.send();
    res.status(202).end();
}