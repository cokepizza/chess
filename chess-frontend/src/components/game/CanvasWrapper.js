import React from 'react';
import styled from 'styled-components';

import CanvasContainer from '../../containers/gameplay/CanvasContainer';

const CanvasWrapperBlock = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.5s;
    opacity: 0;

    &:hover {
        opacity: 1;
    }
`;

const UnClickableBlock = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    /* pointer-events: none; */
`;

const CanvasWrapper = ({ cellSize }) => {
    return (
        <CanvasWrapperBlock>
            <UnClickableBlock>
                <CanvasContainer cellSize={cellSize} />
            </UnClickableBlock>
        </CanvasWrapperBlock>
    )
};

export default React.memo(CanvasWrapper);