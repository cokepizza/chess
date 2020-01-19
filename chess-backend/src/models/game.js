import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
    player: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    winner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    loser: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
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

const Game = mongoose.model('Game', GameSchema);
export default Game;