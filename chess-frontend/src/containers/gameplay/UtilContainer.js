import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askingThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse, setBanClick } from '../../modules/record';

const UtilContainer = () => {
    const { reversed, socket, start, blocked, banClick } = useSelector(({ record, game }) => ({
        socket: record.socket,
        reversed: record.reversed,
        start: game.start,
        blocked: record.blocked,
        banClick: record.banClick,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    const onClick = useCallback(type => {
        if(start && !blocked && !banClick) {
            dispatch(askingThunk({
                socket,
                type,
            }));
            dispatch(setBanClick());
        }
    }, [dispatch, start, socket, blocked, banClick]);

    return (
        <Util
            onReverse={onReverse}
            onClick={onClick}
        />
    )
};

export default UtilContainer;