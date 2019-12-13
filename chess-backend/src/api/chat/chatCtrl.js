export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    const { nickname, color } = req.session;
    io.emit('message', {
        type: 'chat',
        nickname,
        color,
        message: `${req.session.nickname} : ${message}`,
    });

    console.dir('----------http(sendMessage)---------')
    console.dir(req.sessionID);
    res.status(202).end();
};
