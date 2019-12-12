import SocketIO from 'socket.io';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    let counter = 0;
    const player = new Map();

    app.set('io', io);
    app.set('player', player);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })
    io.on('connection', socket => {
        console.dir(socket.id);
        if(counter === 0) {
            player.set('black', socket.id);
        } else if(counter === 1) {
            player.set('white', socket.id);
        } else {
            player.set('spectator', socket.id);
        }
        ++counter;
        
        
        // console.dir(socket.request.session);
        if(socket.request.session.pop) {
            console.dir(socket.request.session.pop);
        } else {
            console.dir(socket.request.session);
        }
        socket.request.session.pop = 'black';
        socket.request.session.save(() => {
            console.dir('savvvv');
        });
        
        // console.dir(socket.request.res);

        // socket.request.session.user = 'black';
        // socket.request.session.save();

        // console.dir(socket.request.session);
        // console.dir(socket);

        console.dir(`welcome : ${socket.id}`);
    })
};