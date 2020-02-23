import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
    kind: String,
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
    user: {
        _id: mongoose.Types.ObjectId,
        username: String
    }
});

const Post = mongoose.model('Post', PostSchema);
export default Post;