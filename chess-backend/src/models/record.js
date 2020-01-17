import mongoose, { Schema } from 'mongoose';

const RecordSchema = new Schema({
    win: Number,
    lose: Number,

    recentPlayer: Array,
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
});

RecordSchema.methods.setRecord = async function() {
    
}

const Record = mongoose.model('Record', RecordSchema);
export default Record;