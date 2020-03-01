import Post from '../../models/post';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const postLimit = 15;

const sanitizeOption = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

export const listPost = async (req, res, next) => {
    const { kind, page = 1 } = req.query;
    
    const query = {
        ...(kind === 'All Posts' ? {} : { kind }),
    };

    try {
        let posts = await Post
            .find(query)
            .sort({ createdAt: -1 })
            .limit(postLimit)
            .skip((page - 1) * postLimit)
            .lean()
            .exec();
    
        posts.forEach(post => {
            delete post.content;
        })

        const postsCount = await Post.countDocuments(query).exec();
        const size = Math.ceil(postsCount / postLimit);

        posts = posts.map((post, index) => ({
            ...post,
            num: postsCount - ((page-1) * postLimit) - index,
        }))
      
        return res.status(202).send({
            posts,
            size,
        });

    } catch(e) {
        return res.status(500).send(e);
    }
}

export const readPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).exec();
    
        return res.status(200).send({
            post
        });
    } catch(e) {
        console.dir(e);
        return res.status(500).send(e);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        await Post.findByIdAndRemove(req.params.id).exec();

        return res.status(200).end();
    } catch(e) {
        console.dir(e);
        return res.status(500).send(e);
    }
};

export const updatePost = async (req, res, next) => {
    const schema = Joi.object().keys({
        kind: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
    });

    const result = Joi.validate(req.body, schema);
    if(result.error) {
        console.dir(result.error);
        return res.status(403).send(result.error);
    }

    const id = req.params.id;
    const nextPost = { ...req.body };

    try {
        await Post.findByIdAndUpdate(id, nextPost, {
            new: true,
        }).exec();
        
        return res.status(200).end();
    } catch(e) {
        console.dir(e);
        return res.status(500).send(e);
    }
};

export const createPost = async (req, res, next) => {
    const schema = Joi.object().keys({
        kind: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
    });

    const result = Joi.validate(req.body, schema);
    if(result.error) {
        console.dir(result.error);
        return res.status(403).send(result.error);
    }

    const { kind, title, content } = req.body;
    const post = new Post({
        kind,
        title: sanitizeHtml(title, sanitizeOption),
        content: sanitizeHtml(content, sanitizeOption),
        user: {
            _id: req.user._id,
            username: req.user.username,
        },
    });

    try {
        await post.save();
    } catch(e) {
        console.dir(e);
        return res.status(500).send(e);
    }

    return res.status(200).end();
}