import React from 'react';
import styled from 'styled-components';

import CanvasWrapperContainer from '../../containers/game/CanvasWrapperContainer';

const GridBoxBlock = styled.div`
    z-index: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 216px;
    height: 216px;
    background-color: rgb(255,255,255, 0.6);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    cursor: pointer;
    transition: 0.5s;

    &:hover {
        background-color: rgb(255,255,255, 0.1);
    }

    &:first-child {
        margin-left: 18px;
    }

    & + & {
        margin-left: 18px;
    }
`

const BoxTitleBlock = styled.div`
    
`;

const BoxContentBlock = styled.div`
    
`;

const GridBox = ({ game, canvas, onClick, onMouseEnter, onMouseLeave, ...rest }) => {
    console.dir('game~');

    return (
        <GridBoxBlock
            onClick={() => onClick(game.key)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...rest}
        >
            <BoxTitleBlock>
                {game.name}
            </BoxTitleBlock>
            <BoxContentBlock>
                {game.participant}
            </BoxContentBlock>
            {canvas ?
            (<CanvasWrapperContainer
                gameKey={game.key}
                cellSize = '27px'
            />)
            : null}
        </GridBoxBlock>
    )
};

export default React.memo(GridBox);