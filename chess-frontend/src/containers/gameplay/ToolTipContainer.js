import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ToolTip from '../../components/gameplay/ToolTip';
import { clearToolTip } from '../../modules/record';

const ToolTipContainer = ({ type }) => {
    const { suggestion, start } = useSelector(({ record, game }) => ({
        suggestion: record[type],
        start: game.start,
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        if(suggestion.message && suggestion.role === 'ask') {
            setTimeout(() => {
                dispatch(clearToolTip({ type }));
            }, 3000);
        }
    }, [dispatch, suggestion.role, suggestion.message, type]);

    useEffect(() => {
        if(!start) {
            dispatch(clearToolTip({ type }));
        }
    }, [dispatch, start, type])

    useEffect(() => {
        return () => {
            dispatch(clearToolTip({ type }));
        }
    }, [dispatch, type])

    return (
        <ToolTip
            type={type}
            role={suggestion.role}
            message={suggestion.message}
        />
    )
};

export default ToolTipContainer;