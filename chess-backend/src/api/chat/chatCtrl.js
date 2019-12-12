export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    io.emit('message', message);

    console.dir('----------http(sendMessage)---------')
    console.dir(req.sessionID);
    console.dir(req.session);
    res.status(202).end();
};
