import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Record from '../../components/gameplay/Record';
import { clearValue } from '../../modules/record';

const RecordContainer = () => {
    const { tempAuth, reversed } = useSelector(({ auth, record }) => ({
        tempAuth: auth.tempAuth,
        reversed: record.reversed,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

    let reversal = false;
    if(tempAuth) {
        if(((tempAuth.role === 'white' || tempAuth.role === 'spectator') && reversed) || (tempAuth.role === 'black' && !reversed)) {
            reversal = true;
        }
    }

    return (
        <Record
            reversal={reversal}
        />
    );
};

export default RecordContainer;