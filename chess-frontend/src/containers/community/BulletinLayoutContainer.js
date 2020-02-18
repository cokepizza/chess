import React from 'react';
import { useSelector } from 'react-redux';
import BulletinLayout from '../../components/community/BulletinLayout';

const BulletinLayoutContainer = () => {
    const { list } = useSelector(({ community }) => ({
        list: community.list,
    }));

    return (
        <BulletinLayout
            list={list}
        />
    );
};

export default BulletinLayoutContainer;
