import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Post from '../../components/community/Post';
import { readPostThunk } from '../../modules/community';

const PostContainer = () => {
    const { id, post } = useSelector(({ community }) => ({
        id: community.post.id,
        post: community.post.post,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readPostThunk({
            id,
        }))
    }, [id]);

    return (
        <Post 
            post={post}
        />
    )
};

export default PostContainer;