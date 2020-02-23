import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import List from '../../components/community/List';
import { clearForm, listPostThunk } from '../../modules/community';

const ListContainer = () => {
    const { menu, list } = useSelector(({ community }) => ({
        menu: community.menu,
        list: community.list,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        const criteria = menu.find(criteria => criteria.checked);
        dispatch(listPostThunk({
            kind: criteria.name,
            page: list.page,
        }));
    }, [dispatch, menu, list.page]);

    useEffect(() => {
        return () => {
            dispatch(clearForm({
                status: 'list',
            }));
        }
    }, [dispatch]);

    return (
        <List
            list={list}
        />
    );
};

export default ListContainer;
