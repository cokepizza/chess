import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Record from '../../components/gameplay/Record';
import { clearValue } from '../../modules/record';

const RecordContainer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

    return (
        <Record />
    );
};

export default RecordContainer;