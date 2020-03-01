import Post from '../../models/post';

const checkOwnPost = async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec();
    
    if(!req.user || !req.user._id) {
        console.dir('Authentication required');
        return res.status(400).send('Authentication required');
    }

    if(post.user._id.toString() !== req.user._id) {
        console.dir('Post authentication not possible');
        return res.status(400).send('Post authentication not possible');
    }

    return next();
};

export default checkOwnPost;