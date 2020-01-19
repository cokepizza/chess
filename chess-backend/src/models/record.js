import mongoose, { Schema } from 'mongoose';

const RecordSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

RecordSchema.methods.setElo = async function() {
    
}

const Record = mongoose.model('Record', RecordSchema);
export default Record;