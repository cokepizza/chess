export const sendMessage = ctx => {
    console.dir('zzzz');
    // console.dir(ctx);
    // ctx.socket.emit('haha');
    const { message } = ctx.request.body;
    // console.dir(ctx.socket);
    // ctx.body = ctx.socket;
    // ctx.socket.broadcast.emit('message', message);
    // const { socket } = ctx.state;
    

    // console.dir(socket);
    // console.dir(io);
    console.dir(message);
    console.dir(app._io);
    socket.broadcast.emit('message', message);
    socket.emit('message', message);
};
