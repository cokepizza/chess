import React from 'react';
import { useSelector } from 'react-redux';
import BulletinLayout from '../../components/community/BulletinLayout';

const BulletinLayoutContainer = ({ index }) => {
    const { board } = useSelector(({ community }) => ({
        board: community.community[index],
    }));

    return (
        <BulletinLayout
            board={board}
        />
    );
};

export default BulletinLayoutContainer;
