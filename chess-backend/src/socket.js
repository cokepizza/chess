import SocketIO from 'socket.io';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })
    io.on('connection', socket => {        
        //  첫 http request 이후 세션 고정
        //  socket과 http request가 동일한 세션을 공유할 수 있음

        console.dir('-------------socket--------------')
        console.dir(socket.request.sessionID);
        console.dir(`welcome : ${socket.id}`);
        socket.on('message', message => console.dir(message));
        socket.on('disconnect', () => {
            console.dir('-------------disconnect--------------')
            console.dir(socket.request.sessionID);
        })
    })
    
};