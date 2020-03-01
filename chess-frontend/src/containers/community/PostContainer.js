import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Post from '../../components/community/Post';
import { readPostThunk, clearFormAll, setStatus, deletePostThunk, setForm } from '../../modules/community';

const PostContainer = () => {
    const { id, post, auth } = useSelector(({ community, sessionAuth }) => ({
        id: community.post.id,
        post: community.post.post,
        auth: sessionAuth.auth,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readPostThunk({
            id,
        }))
    }, [dispatch, id]);

    useEffect(() => {
        return () => {
            dispatch(clearFormAll({
                status: 'post',
            }));
        };
    }, [dispatch]);

    const onUpdate = useCallback(async (post) => {
        dispatch(setForm({
            status: 'write',
            key: 'title',
            value: post.title,
        }));
        dispatch(setForm({
            status: 'write',
            key: 'content',
            value: post.content,
        }));
        dispatch(setForm({
            status: 'write',
            key: 'modify',
            value: post._id,
        }));
        dispatch(setStatus({
            status: 'write',
        }));
    }, [dispatch]);

    const onDelete = useCallback(async (id) => {
        await dispatch(deletePostThunk({ id }));
        dispatch(setStatus({
            status: 'list',
        }));
    }, [dispatch]);

    return (
        <Post 
            post={post}
            auth={auth}
            onUpdate={onUpdate}
            onDelete={onDelete}
        />
    )
};

export default PostContainer;