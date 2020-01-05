import mongoose from 'mongoose';

const dbConfig = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => {
        console.error(e);
    });
};

export default dbConfig;