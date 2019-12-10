export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    io.emit('message', message);
    console.dir(`message received : ${message}`);
    res.status(202).end();
};
