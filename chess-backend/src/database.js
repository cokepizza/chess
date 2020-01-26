import mongoose from 'mongoose';

const dbConfig = async () => {
    try {
        await  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });
        console.log('Connected to MongoDB');
    } catch(e) {
        console.error(e);
    }
};

export default dbConfig;