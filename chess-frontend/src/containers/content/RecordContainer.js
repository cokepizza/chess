import React from 'react';
import { useSelector } from 'react-redux';
import Record from '../../components/content/Record';

const RecordContainer = () => {
    
    const { record } = useSelector(({ record }) => ({
        record: record.record,
    }));

    console.dir(record);
    return (
        <Record
            record={record}
        />
    );
};

export default RecordContainer;