import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import List from '../../components/community/List';
import { clearFormAll, listPostThunk, setStatus, setForm } from '../../modules/community';

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
            dispatch(clearFormAll({
                status: 'list',
            }));
        }
    }, [dispatch]);

    const onClick = useCallback(() => {
        dispatch(setStatus({
            status: 'post',
        }));
    }, [dispatch]);

    return (
        <List
            list={list}
            onClick={onClick}
        />
    );
};

export default ListContainer;
