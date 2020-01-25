import React from 'react';
import { useSelector } from 'react-redux';

import List from '../../components/main/List';

const ListContainer = () => {
    const { list } = useSelector(({ ranking }) => ({
        list: ranking.list
    }));

    const data = [
        
    ];

    return (
        <List list={list}/>
    )
};

export default ListContainer;