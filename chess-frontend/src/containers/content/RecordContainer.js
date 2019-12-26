import React from 'react';
import { useSelector } from 'react-redux';
import Record from '../../components/content/Record';

const RecordContainer = () => {
    
    const { record, game } = useSelector(({ record, game }) => ({
        record: record.record,
        game: game.game,
    }));

    
    return (
        <Record
            record={record}
            game={game}
        />
    );
};

export default RecordContainer;