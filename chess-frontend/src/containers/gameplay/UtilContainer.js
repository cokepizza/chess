import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askingThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse } from '../../modules/record';

const UtilContainer = () => {
    const { reversed, socket, start, blocked } = useSelector(({ record, game }) => ({
        socket: record.socket,
        reversed: record.reversed,
        start: game.start,
        blocked: record.blocked,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    const onClick = useCallback(type => {
        if(start && !blocked) {
            dispatch(askingThunk({
                socket,
                type,
            }));
        }
    }, [dispatch, start, socket, blocked]);

    return (
        <Util
            onReverse={onReverse}
            onClick={onClick}
        />
    )
};

export default UtilContainer;