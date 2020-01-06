import mongoose, { Schema } from 'mongoose';

const RecordSchema = new Schema({
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
    },
});

const Record = mongoose.model('Record', RecordSchema);
export default Record;