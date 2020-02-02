import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ToolTip from '../../components/gameplay/ToolTip';
import { clearToolTip, answeringThunk } from '../../modules/record';

const ToolTipContainer = ({ type }) => {
    const { socket, suggestion, start } = useSelector(({ record, game }) => ({
        socket: record.socket,
        suggestion: record[type],
        start: game.start,
    }));

    const dispatch = useDispatch();
    const [ race, setRace ] = useState(false);
    const [ restrict, setRestrict ] = useState(false);

    useEffect(() => {
        if(suggestion.modal) {
            setRestrict(false);
            setRace(true);
        }
    }, [dispatch, suggestion.modal]);

    useEffect(() => {
        if(suggestion.message) {
            setRace(false);
        }
    }, [suggestion.message])

    useEffect(() => {
        if(!start && suggestion.modal) {
            setRace(false);
            dispatch(clearToolTip());
        }
    }, [dispatch, start, suggestion.modal, type])

    useEffect(() => {
        return () => {
            dispatch(clearToolTip());
        }
    }, [dispatch, type])

    const onClick = useCallback(response => {
        dispatch(answeringThunk({
            socket,
            type,
            response,
        }));
        setRestrict(true);
    }, [dispatch, socket, type]);

    return (
        <ToolTip
            type={type}
            modal={suggestion.modal}
            message={suggestion.message}
            race={race}
            restrict={restrict}
            onClick={onClick}
        />
    )
};

export default ToolTipContainer;