import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CommunityLayout from '../../components/community/CommunityLayout';
import { setMenuThunk, setStatus } from '../../modules/community';

const CommunityLayoutContainer = () => {
    const { menu, status } = useSelector(({ community }) => ({
        menu: community.menu,
        status: community.status,
    }));

    const dispatch = useDispatch();

    const onClick = useCallback(index => {
        dispatch(setMenuThunk(index));
        dispatch(setStatus({
            status: 'list'
        }));
    }, [dispatch]);

    const onCreatePost = useCallback(() => {
        dispatch(setStatus({
            status: 'write'
        }));
    }, [dispatch]);

    return (
        <CommunityLayout
            menu={menu}
            status={status}
            onClick={onClick}
            onCreatePost={onCreatePost}
        />
    );
};

export default CommunityLayoutContainer;