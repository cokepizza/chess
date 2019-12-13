export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    console.dir(io);
    io.emit('message', {
        type: 'chat',
        color: req.session.color,
        message: `${req.session.nickname} : ${message}`,
    });

    console.dir('----------http(sendMessage)---------')
    console.dir(req.sessionID);
    res.status(202).end();
};
