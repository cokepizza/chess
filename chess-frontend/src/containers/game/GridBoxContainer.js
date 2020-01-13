import React, { useCallback, useState } from 'react';
import { withRouter } from 'react-router-dom';

import GridBox from '../../components/game/GridBox';

const GridBoxContainer = ({ history, ...rest }) => {
    const [ canvas, setCanvas ] = useState(false);

    const onMouseEnter = useCallback(() => {
        setCanvas(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        setCanvas(false);
    }, []);

    const onClick = useCallback((gameId) => {
        history.push(`/game/${gameId}`);
    }, [history]);

    return (
        <GridBox
            {...rest}
            canvas={canvas}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    )
};

export default withRouter(GridBoxContainer);