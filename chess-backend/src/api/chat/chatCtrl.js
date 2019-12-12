export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    io.emit('message', message);
    // if(!req.session.number) {
    //     req.session.number = ++counter;
    //     console.dir(req.session);
    // }
    // req.session.save(() => {
    //     console.dir('save');
    // })
    // req.session.save();
    console.dir(req.sessionID);

    req.session.turn = 'whhhhoop';
    req.session.save(() => {
        console.dir('save com')
    });

    
    console.dir(`message received : ${message}`);
    res.status(202).end();
};
