let counter = 0;
export const getSession = (req, res, next) => {    
    req.session.turn = ++counter;
    req.session.save();
    console.dir('----------http(getSession)---------')
    console.dir(req.sessionID);
    console.dir(req.session);
    const io = req.app.get('io');
    io.emit('message', 'zzz');

    res.status(202).end();
}