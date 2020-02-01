import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ToolTip from '../../components/gameplay/ToolTip';
import { clearToolTip, setRequestMessage, answeringThunk } from '../../modules/record';

const ToolTipContainer = ({ type }) => {
    const { socket, suggestion, start } = useSelector(({ record, game }) => ({
        socket: record.socket,
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

    const onClick = useCallback(response => {
        dispatch(answeringThunk({
            socket,
            type,
            response,
        }));
        dispatch(setRequestMessage({
            type,
            message: `response: ${response}`,
        }));
    }, [dispatch, socket, type]);

    return (
        <ToolTip
            type={type}
            role={suggestion.role}
            message={suggestion.message}
            onClick={onClick}
        />
    )
};

export default ToolTipContainer;