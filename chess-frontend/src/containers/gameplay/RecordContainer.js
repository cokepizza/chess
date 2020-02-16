import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Record from '../../components/gameplay/Record';
import { clearValue } from '../../modules/record';

const RecordContainer = () => {
    const { role, reversed } = useSelector(({ socketAuth, record }) => ({
        role: socketAuth.role,
        reversed: record.reversed,
    }));

    const dispatch = useDispatch();

    const [ init, setInit ] = useState(false);

    useEffect(() => {
        if(!init) {
            setInit(true);
        }
    }, [role]);

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

    let reversal = false;
    if(((role === 'white' || role === 'spectator') && reversed) || (role === 'black' && !reversed)) {
        reversal = true;
    }

    return (
        <Record
            init={init}
            reversal={reversal}
        />
    );

    // return null;
};

export default RecordContainer;