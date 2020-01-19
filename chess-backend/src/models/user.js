import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    game: {
        win: [{
            type: mongoose.Types.ObjectId,
            ref: 'Game',
        }],
        lose: [{
            type: mongoose.Types.ObjectId,
            ref: 'Game',
        }],
        draw: [{
            type: mongoose.Types.ObjectId,
            ref: 'Game',
        }],
    },
    record: {
        type: mongoose.Types.ObjectId,
        ref: 'Record',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

const User = mongoose.model('User', UserSchema);
export default User;