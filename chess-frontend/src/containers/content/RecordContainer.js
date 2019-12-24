import React from 'react';
import { useSelector } from 'react-redux';
import Record from '../../components/content/Record';

const RecordContainer = () => {
    const { status } = useSelector(({ game }) => ({
        status: game.status,
    }));

    return (
        <Record
            status={status}
        />
    );
};

export default RecordContainer;