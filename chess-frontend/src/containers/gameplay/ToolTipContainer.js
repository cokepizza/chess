import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ToolTip from '../../components/gameplay/ToolTip';
import { clearToolTip } from '../../modules/record';

const ToolTipContainer = ({ type }) => {
    const { suggestion } = useSelector(({ record }) => ({
        suggestion: record[type],
    }));

    const dispatch = useDispatch();

    useEffect(() => {
        if(suggestion.message && suggestion.role === 'ask') {
            setTimeout(() => {
                dispatch(clearToolTip({ type }));
            }, 1000);
        }
    }, [suggestion.message]);

    useEffect(() => {
        return () => {
            dispatch(clearToolTip({ type }));
        }
    }, [])

    if(!suggestion.role) {
        return null;
    }

    return (
        <ToolTip
            message={suggestion.message}
        />
    )
};

export default ToolTipContainer;