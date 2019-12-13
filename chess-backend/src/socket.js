import SocketIO from 'socket.io';

export default (server, app, sessionMiddleware) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })
    io.on('connection', socket => {        
        //  io connection시에는 sessionID가 다르지만, 첫 http request 이후 세션 고정
        //  socket과 http request가 동일한 세션을 공유할 수 있음

        console.dir('-------------socket--------------')
        console.dir(socket.request.sessionID);
        
        //  socket.emit()은 소켓이 직접 연결된 세션에만
        //  io.emit()은 연결된 모든 소켓에 broadcast
        io.emit('message', `${socket.request.session.color} connected, role : ${socket.request.session.role}`);

        socket.on('message', () => {
            console.dir('-------------serveronMessage--------------')
            console.dir(socket.request.sessionID);
        });

        socket.on('disconnect', () => {
            console.dir('-------------disconnect--------------')
            console.dir(socket.request.sessionID);
        })
    })
};