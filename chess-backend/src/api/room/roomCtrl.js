export const readRoom = (req, res, next) => {
    const room = req.app.get('room');
    
    const { mapSessionToSocket } = req.app.get('mapper');
    const socket = mapSessionToSocket.get(req.session.id);
    
    socket.join('room');
    socket.emit('message', {
        type: 'room',
        room,
    });

    res.send();
    res.status(202).end();
};

export const createRoom = (req, res, next) => {
    const io = req.app.get('io');

    const room = req.app.get('room');
    const length = room.length;

    const { nickname } = req.session;

    room.push({
        name: `room${length}`,
        user: [nickname],
    });

    io.emit('message', {
        type: 'room',
        room,
    });

    res.send();
    res.status(202).end();
}