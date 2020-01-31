import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askingThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse, initializeToolTip } from '../../modules/record';

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
        dispatch(askingThunk({
            socket,
            type: 'surrender'
        }));
        dispatch(initializeToolTip({
            type: 'surrender',
            role: 'ask',
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