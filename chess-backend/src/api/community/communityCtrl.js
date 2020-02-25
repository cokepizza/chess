import Post from '../../models/post';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

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

    let posts = await Post
        .find(query)
        .limit(15)
        .skip((page - 1) * 15)
        .lean()
        .exec();
    
    posts.forEach(post => {
        delete post.content;
    })

    const postsCount = await Post.countDocuments(query).exec();
    const size = Math.ceil(postsCount / 10);

    return res.status(202).send({
        posts,
        size,
    });
}

export const readPost = async (req, res, next) => {
    
    return res.status(200).end();
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
        }
    });

    try {
        await post.save();
    } catch(e) {
        console.dir(e);
        return res.status(500).send(e);
    }

    return res.status(200).end();
}