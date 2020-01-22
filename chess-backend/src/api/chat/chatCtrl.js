export const sendMessage = (req, res, next) => {
    console.dir(req.session);
    const io = req.app.get('io');
    const { socket: socketId, message } = req.body;
    const { nickname, color } = req.session;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    
    console.dir(socketId);
    console.dir(key);
    io.of('/chat').to(key).emit('message', {
        type: 'change',
        nickname,
        color,
        message,
    });

    console.dir('----------http(sendMessage)---------')
    console.dir(req.sessionID);
    return res.status(202).end();
};