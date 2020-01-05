import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    }
});

const Game = mongoose.model('Game', GameSchema);
export default Game;