import React from 'react';
import styled from 'styled-components';
import { FaChessBoard } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const gridSize = 3;

const GridRowBlock = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const GridBoxBlock = styled.div`
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 216px;
    height: 216px;
    background-color: rgb(255,255,255, 0.6);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    cursor: pointer;
    transition: 1s;

    &:hover {
        background-color: rgb(255,255,255, 0.1);
    }
`

const BoxTitleBlock = styled.div`
    
`;

const BoxContentBlock = styled.div`
    
`;

const GridBox = React.memo(({ game, ...rest }) => {
    console.dir('game~');
    
    return (
        <GridBoxBlock {...rest}>
            <BoxTitleBlock>
                {game.name}
            </BoxTitleBlock>
            <BoxContentBlock>
                {game.participant}
            </BoxContentBlock>
        </GridBoxBlock>
    )
});

const GridLayoutBlock = styled.div`
    width: 720px;
    height: 720px;
    padding: 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    position: relative;
    
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const GridLayout = ({ games, onGameClick }) => {
   
    if(!games) return <GridLayoutBlock />;

    const list = [ ...games ];
    
    const backgroundStyle = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        opacity: '0.05',
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
                        <GridBox
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
        <GridLayoutBlock>
            {gridArr}
            <IconContext.Provider value={{ style: backgroundStyle }}>
                <FaChessBoard />
            </IconContext.Provider>
        </GridLayoutBlock>
    )
};

export default React.memo(GridLayout);