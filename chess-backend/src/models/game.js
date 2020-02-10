import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
    //  !draw && player[0] => winner, !draw && player[1] => loser
    player: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    draw: Boolean,
    name: String,
    turn: Number,
    map: String,
    mode: String,
    defaultTime: Number,
    extraTime: Number,
    reasonType: Number,
    reasonMessage: String,
    pieceMove: String,
    createdAt: Date,
    destroyAt: {
        type: Date,
        default: Date.now,
    },
});

GameSchema.methods.serialize = function() {
    const data = this.toJSON();
    return data;
};

const Game = mongoose.model('Game', GameSchema);
export default Game;