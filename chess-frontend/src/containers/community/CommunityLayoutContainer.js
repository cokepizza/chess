import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CommunityLayout from '../../components/community/CommunityLayout';
import { setMenuThunk, setStatus, setForm, clearForm, clearAll } from '../../modules/community';

const CommunityLayoutContainer = () => {
    const { menu, status } = useSelector(({ community }) => ({
        menu: community.menu,
        status: community.status,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearAll());
        }
    }, [dispatch]);

    const onClick = useCallback(index => {
        const checkedIndex = menu.findIndex(criteria => criteria.checked);
        if(index === checkedIndex) return;

        dispatch(setMenuThunk(index));

        //  clear page before rendering
        dispatch(clearForm({
            status: 'list',
            key: 'page',
        }));
        
        dispatch(setStatus({
            status: 'list',
        }));
    }, [dispatch, menu]);

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