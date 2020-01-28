const registerCache = app => {
    const ranking = app.get('ranking');
    ranking._broadcast = function() {
        io.of('/ranking').emit({
            type: 'initialize',
            ranking: ranking.list.slice(0, this.limit),
        });
    };
    ranking._unicast = function(socket) {
        socket.emit('message', {
            type: 'initialize',
            ranking: ranking.list.slice(0, this.limit),
        })
    };
};

export default registerCache;