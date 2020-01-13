import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Util from '../../components/gameplay/Util';
import { changeReverse } from '../../modules/record';

const UtilContainer = () => {
    const { reversed } = useSelector(({ record }) => ({
        reversed: record.reversed,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    return (
        <Util
            onReverse={onReverse}
        />
    )
};

export default UtilContainer;