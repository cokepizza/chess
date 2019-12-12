import SocketIO from 'socket.io';
// import sharedSession from 'express-socket.io-session';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    let counter = 0;
    
    app.set('io', io);
    // io.use(sharedSession(sessionMiddleware, {
    //     autoSave: true
    // }));
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })
    io.on('connection', socket => {
        // if(counter === 0) {
        //     socket.handshake.session.player = 'black';
        // } else if(counter === 1) {
        //     socket.handshake.session.player = 'white';
        // } else {
        //     socket.handshake.session.player = 'spectator';
        // }
        // ++counter;
        
        // console.dir(socket.handshake.session.id);
        // console.dir(socket.handshake.sessionID);
        // socket.handshake.session.save();

        // console.dir(socket.handshake);

        // console.dir(socket.request.session);
        // if(socket.request.session.pop) {
        //     console.dir(socket.request.session.pop);
        // } else {
        //     console.dir(socket.request.session);
        // }
        // socket.request.session.pop = 'black';
        // socket.request.session.save(() => {
        //     console.dir('savvvv');
        // });
        console.dir(socket.request.sessionID);
        // socket.request.session.pop = 3;
        // socket.request.session.save();
        console.dir(socket.request.session.id);

        // socket.request.session.user = 'black';
        // socket.request.session.save();

        // console.dir(socket.request.session);
        // console.dir(socket);

        console.dir(`welcome : ${socket.id}`);
    })
};