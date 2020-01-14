import React from 'react';
import styled from 'styled-components';
import { FaChessBoard } from 'react-icons/fa';
import { IconContext } from 'react-icons';

import GridBoxContainer from '../../containers/game/GridBoxContainer';

const gridSize = 3;

const GridRowBlock = styled.div`
    display: flex;
    width: 100%;

    &:first-child {
        margin-top: 18px;
    }

    &:last-child {
        margin-bottom: 18px;
    }

    & + & {
        margin-top: 18px;
    }
`;

const GridLayoutFrameBlock = styled.div`
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
`;

const GridLayoutHiddenBlock = styled.div`
    width: 720px;
    height: 720px;
    overflow: hidden;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const GridLayoutBlock = styled.div`
    width: 720px;
    height: 720px;
    /* padding: 18px; */
    /* box-sizing: border-box; */
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: overlay;
    padding-right: 20px;
    /* background-color: transparent; */
    
`;

// const PieceMoveListBlock = styled.div`
//     height: 270px;
//     width: 100%;
//     overflow-y: overlay;
//     padding-right: 20px;
// `;

const GridLayout = ({ games, onGameClick }) => {
   
    if(!games) return <GridLayoutBlock />;

    const list = [ ...games ];
    
    const backgroundStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '720px',
        height: '720px',
        opacity: '0.2',
        zIndex: -1,
    }
    const gridArr = [];
    const rowSize = Math.floor(list.length / gridSize);
    for(let i=0; i<=rowSize; ++i) {
        gridArr.push(
            <GridRowBlock
                key={`GridRowBlock_${i}`}
            >
                {
                    list.splice(0, gridSize).map(game => (
                        <GridBoxContainer
                            key={`GridBox${game.name}`}
                            game={game}
                            onClick={e => onGameClick(e, game.key)}
                        />
                    ))
                }
            </GridRowBlock>
        );
    }

    return (
        <GridLayoutFrameBlock>
            <GridLayoutHiddenBlock>
                <GridLayoutBlock>
                    {gridArr}
                </GridLayoutBlock>
            </GridLayoutHiddenBlock>
            <IconContext.Provider value={{ style: backgroundStyle }}>
                <FaChessBoard />
            </IconContext.Provider>
        </ GridLayoutFrameBlock>
    )
};

export default React.memo(GridLayout);