import cache from './cache';

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
    ranking._reset = async function() {
        const config = await cache();
        this.list = config.ranking.list;
    };
    ranking._register = async function({ winner, loser }) {
        const winnerObj = winner.toJSON();
        const loserObj = loser.toJSON();
        const length = this.list.length;

        const winnerIndex = binarySearch(0, length, this.list, {
            ...winnerObj,
            win: winnerObj.win-1,
        });
        const loserIndex = binarySearch(0, length, this.list, {
            ...loserObj,
            lose: loserObj.lose-1,
        });

        if(0 <= winnerIndex && winnerIndex < length && 0 <= loserIndex && loserIndex < length) {
            if(winnerIndex > loserIndex) {
                this.list.splice(winnerIndex);
                this.list.splice(loserIndex);
            } else {
                this.list.splice(loserIndex);
                this.list.splice(winnerIndex);
            }
            
            ranking.addUser(winner);
            ranking.addUser(loser);
        } else if(!this._acting) {
            console.dir('error emerge! reset ranking');
            await this._reset();
            
            //  Prevent loop
            this._acting = true;
            await this._register({ winner, loser });
            this._acting = false;
        }
    };
    ranking.addUser = function(user) {
        console.dir(user);
    };
};

export default registerCache;