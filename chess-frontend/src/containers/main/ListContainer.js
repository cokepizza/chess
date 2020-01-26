import React from 'react';
import { useSelector } from 'react-redux';

import List from '../../components/main/List';

const ListContainer = ({ list }) => {

    return (
        <List list={list}/>
    )
};

export default ListContainer;