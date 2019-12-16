import React from 'react';
import styled from 'styled-components';

const gridSize = 3;

const GridRowBlock = styled.div`
    display: flex;
    width: 85%;

    & + & {
        margin-top: 50px;
    }

    &:first-child {
        margin-top: 50px;
    }

    &:last-child {
        margin-bottom: 50px;
    }
`;

const GridBoxBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 24%;
    height: 300px;
    background-color: rgb(0,0,0, 0.4);
    box-shadow: 5px 5px 5px rgb(0,0,0,0.6);
    cursor: pointer;
    
    & + & {
        margin-left: 13%;
    }

    &:active {
        background-color: rgb(0,0,0, 0.6);
        box-shadow: 5px 5px 5px rgb(0,0,0,0.8);
    }
`

const BoxTitleBlock = styled.div`
    
`;

const BoxContentBlock = styled.div`
    
`;

const GridBox = React.memo(({ room, ...rest }) => {
    console.dir('room~');
    
    return (
        <GridBoxBlock {...rest}>
            <BoxTitleBlock>
                {room.name}
            </BoxTitleBlock>
            <BoxContentBlock>
                {room.participant}
            </BoxContentBlock>
        </GridBoxBlock>
    )
});

const GridLayoutBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 90%;
    overflow-y: scroll;
    background-color: rgb(0,0,0, 0.2);
    box-shadow: 5px 5px 5px rgb(0,0,0,0.4);
`;

const GridLayout = ({ room, onRoomClick }) => {

    if(!room) return <GridLayoutBlock />;

    const list = [ ...room ];
    
    const gridArr = [];
    const rowSize = Math.floor(list.length / gridSize);
    for(let i=0; i<=rowSize; ++i) {
        gridArr.push(
            <GridRowBlock
                key={`GridRowBlock_${i}`}
            >
                {
                    list.splice(0, gridSize).map(room => (
                        <GridBox
                            key={`GridBox${room.name}`}
                            room={room}
                            onClick={e => onRoomClick(e, room.key)}
                        />
                    ))
                }
            </GridRowBlock>
        );
    }

    return (
        <GridLayoutBlock>
            {gridArr}
        </GridLayoutBlock>
    )
};

export default React.memo(GridLayout);