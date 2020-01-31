import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { sendSurrenderThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse } from '../../modules/record';

const UtilContainer = () => {
    const { reversed, socket } = useSelector(({ record }) => ({
        socket: record.socket,
        reversed: record.reversed,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    const onSurrender = useCallback(() => {
        dispatch(sendSurrenderThunk({
            socket,
        }));
    }, [dispatch, socket]);

    return (
        <Util
            onReverse={onReverse}
            onSurrender={onSurrender}
        />
    )
};

export default UtilContainer;