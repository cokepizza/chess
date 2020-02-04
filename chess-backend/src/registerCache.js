import cache, { compare } from './cache';
import binarySearch from './lib/util/binarySearch';

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

        this.addWinUser(winnerObj);
        this.addLoseUser(loserObj);

        const loserIndex = binarySearch(0, length, this.list, {
            ...loserObj,
            lose: loserObj.lose-1,
        });

        if(0 <= winnerIndex && winnerIndex < length && 0 <= loserIndex && loserIndex < length) {
            if(winnerIndex > loserIndex) {
            
                this.list.splice(loserIndex);
            } else {
                this.list.splice(loserIndex);
                this.list.splice(winnerIndex);
            }
            
        } else if(!this._acting) {
            console.dir('error emerge! reset ranking');
            await this._reset();
            
            //  Prevent loop
            this._acting = true;
            await this._register({ winner, loser });
            this._acting = false;
        }
    };
    ranking.addWinUser = function(obj) {
        const index = binarySearch(0, length, this.list, {
            ...obj,
            win: obj.win-1,
        });
        
        if(0 <= index && index < length) {
            let i;
            for(i=index; i>=0; --i) {
                if(compare(this.list[i], obj) < 0) {
                    break;
                }
            }
            this.list.splice(i+1, 0, obj);
            this.list.splice(index + 1);
            console.dir(list);
        }

    };
    ranking.addLoseUser = function(index, obj) {

    };
};

export default registerCache;