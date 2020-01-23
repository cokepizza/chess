import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Record from '../../components/gameplay/Record';
import { clearValue } from '../../modules/record';

const RecordContainer = () => {
    const { role, reversed } = useSelector(({ socketAuth, record }) => ({
        role: socketAuth.role,
        reversed: record.reversed,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

    let reversal = false;
    if(((role === 'white' || role === 'spectator') && reversed) || (role === 'black' && !reversed)) {
        reversal = true;
    }

    if(role) {
        return (
            <Record
                reversal={reversal}
            />
        );
    }

    return null;
};

export default RecordContainer;