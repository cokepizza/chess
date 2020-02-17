import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CommunityLayout from '../../components/community/CommunityLayout';
import { checkChangeThunk } from '../../modules/community';

const CommunityLayoutContainer = () => {
    const { community } = useSelector(({ community }) => ({
        community: community.community,
    }));

    const dispatch = useDispatch();

    const onClick = useCallback(index => {
        dispatch(checkChangeThunk(index));
    }, [dispatch]);

    return (
        <CommunityLayout
            community={community}
            onClick={onClick}
        />
    );
};

export default CommunityLayoutContainer;