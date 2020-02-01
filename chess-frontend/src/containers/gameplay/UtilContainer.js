import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { askingThunk } from '../../modules/record';
import Util from '../../components/gameplay/Util';
import { changeReverse, setRequestRole } from '../../modules/record';

const UtilContainer = () => {
    const { reversed, socket, start, undo, draw, surrender } = useSelector(({ record, game }) => ({
        socket: record.socket,
        reversed: record.reversed,
        start: game.start,
        undo: record.undo,
        draw: record.draw,
        surrender: record.surrender,
    }));

    const dispatch = useDispatch();
    
    const onReverse = useCallback(() => {
        dispatch(changeReverse({ reversed: !reversed }));
    }, [dispatch, reversed]);

    const onClick = useCallback(type => {
        if(start) {
            if(!undo.role && !draw.role && !surrender.role) {
                dispatch(askingThunk({
                    socket,
                    type,
                }));
                dispatch(setRequestRole({
                    type,
                    role: 'ask',
                }));
            }
        }
    }, [dispatch, start, socket, undo.role, draw.role, surrender.role]);

    return (
        <Util
            onReverse={onReverse}
            onClick={onClick}
        />
    )
};

export default UtilContainer;