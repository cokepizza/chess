import React, { useEffect, useCallback, useRef, useState } from 'react';
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
    const [ race, setRace ] = useState(false);

    // useEffect(() => {
    //     if(suggestion.message && suggestion.role) {
    //         clearTimeout(setTimeoutRef.current);
    //         console.dir('ask 클리어 전');
    //         setTimeoutRef.current = setTimeout(() => {
    //             console.dir('ask 클리어 후');
    //             setRace(false);
    //             dispatch(clearToolTip({ type }));
    //         }, 3000);
    //     }
    // }, [dispatch, suggestion.role, suggestion.message, type]);

    useEffect(() => {
        if(suggestion.modal) {
            setRace(true);
            // clearTimeout(setTimeoutRef.current);
            // setTimeoutRef.current = setTimeout(() => {
            //     setRace(false);
            //     dispatch(setRequestMessage({
            //         type,
            //         message: `response: null`,
            //     }));
            // }, 5000);
        }
    }, [dispatch, suggestion.modal]);

    useEffect(() => {
        if(suggestion.message) {
            setRace(false);
        }
    }, [suggestion.message])

    useEffect(() => {
        if(!start) {
            dispatch(setRequestMessage({
                type,
                message: 'rejected',
            }));
        }
    }, [dispatch, start, type])

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
    }, [dispatch, socket, type]);

    return (
        <ToolTip
            type={type}
            modal={suggestion.modal}
            message={suggestion.message}
            race={race}
            onClick={onClick}
        />
    )
};

export default ToolTipContainer;