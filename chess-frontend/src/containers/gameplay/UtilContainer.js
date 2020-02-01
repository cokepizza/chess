import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askingThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse, setRequestRole } from '../../modules/record';

const UtilContainer = () => {
    const { reversed, socket, start } = useSelector(({ record, game }) => ({
        socket: record.socket,
        reversed: record.reversed,
        start: game.start,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    const onSurrender = useCallback(() => {
        if(start) {
            dispatch(askingThunk({
                socket,
                type: 'surrender'
            }));
            dispatch(setRequestRole({
                type: 'surrender',
                role: 'ask',
            }));
        }
    }, [dispatch, start, socket]);

    return (
        <Util
            onReverse={onReverse}
            onSurrender={onSurrender}
        />
    )
};

export default UtilContainer;