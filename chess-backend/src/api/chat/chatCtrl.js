export const sendMessage = (req, res, next) => {
    const io = req.app.get('io');
    const { message } = req.body;
    io.emit('message', message);
    console.dir(`message received : ${message}`);
    // console.dir(ctx);
    // ctx.socket.emit('haha');
    
    // console.dir(ctx.socket);
    // ctx.body = ctx.socket;
    // ctx.socket.broadcast.emit('message', message);
    // const { socket } = ctx.state;
    

    // console.dir(socket);
    // console.dir(io);
    // console.dir(message);
    // console.dir(app._io);
    // socket.broadcast.emit('message', message);
    // socket.emit('message', message);
};
