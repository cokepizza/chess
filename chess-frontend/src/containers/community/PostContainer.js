import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Post from '../../components/community/Post';
import { readPostThunk, clearFormAll, setStatus, deletePostThunk } from '../../modules/community';

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

    useEffect(() => {
        return () => {
            dispatch(clearFormAll({
                status: 'post',
            }));
        };
    }, []);

    const onUpdate = useCallback(() => {

    }, []);

    const onDelete = useCallback(async (id) => {
        await dispatch(deletePostThunk({ id }));
        dispatch(setStatus({
            status: 'list',
        }));
    }, [dispatch]);

    return (
        <Post 
            post={post}
            onUpdate={onUpdate}
            onDelete={onDelete}
        />
    )
};

export default PostContainer;