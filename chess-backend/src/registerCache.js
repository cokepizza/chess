import cache, { compare, getRatio } from './cache';
import binarySearch from './lib/util/binarySearch';

const registerCache = app => {
    const ranking = app.get('ranking');
    const io = app.get('io');

    ranking._broadcast = function() {
        io.of('/ranking').emit('message', {
            type: 'initialize',
            ranking: this.list.slice(0, this.limit),
        });
    };
    ranking._unicast = function(socket) {
        socket.emit('message', {
            type: 'initialize',
            ranking: this.list.slice(0, this.limit),
        })
    };
    ranking._reset = async function() {
        const config = await cache();
        this.list = config.ranking.list;
    };
    ranking._register = function({
        winnerBefore,
        loserBefore,
        winnerAfter,
        loserAfter
    }) {
        this.addWinUser(winnerBefore, winnerAfter);
        this.addLoseUser(loserBefore, loserAfter);
        
        // if(!this._acting) {
        //     console.dir('error emerge! reset ranking');
        //     await this._reset();
            
        //     //  Prevent loop
        //     this._acting = true;
        //     await this._register({ winner, loser });
        //     this._acting = false;
        // }
    };
    ranking.addWinUser = function(beforeObj, obj) {
        const length = this.list.length;
        // const index = binarySearch(0, length, this.list, {
        //     ...obj,
        //     win: obj.win-1,
        //     ratio: getRatio({
        //         win: obj.win-1,
        //         lose: obj.lose,
        //     }).ratio,
        // });
        const index = binarySearch(0, length, this.list, beforeObj);
        
        if(index < 0) {
            console.dir('Find user in cache failed')
            return;
        }

        let i;
        for(i=index-1; i>=0; --i) {
            if(compare(obj, this.list[i]) > 0) {
                break;
            }
        }

        console.dir(obj);
        this.list.splice(i+1, 0, obj);
        this.list.splice(index + 1, 1);
    };
    ranking.addLoseUser = function(beforeObj, obj) {
        const length = this.list.length;
        // const index = binarySearch(0, length, this.list, {
        //     ...obj,
        //     lose: obj.lose-1,
        //     ratio: getRatio({
        //         win: obj.win,
        //         lose: obj.lose-1,
        //     }).ratio,
        // });
        const index = binarySearch(0, length, this.list, beforeObj);
        
        if(index < 0) {
            console.dir('Find user in cache failed')
            return;
        }

        let i;
        for(i=index+1; i<length; ++i) {
            if(compare(obj, this.list[i]) < 0) {
                break;
            }
        }

        console.dir(obj);
        this.list.splice(i-1, 0, obj);
        this.list.splice(index, 1);
    };
};

export default registerCache;