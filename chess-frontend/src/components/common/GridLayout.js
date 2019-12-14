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
    justify-content: center;
    align-items: center;
    width: 24%;
    height: 300px;
    background-color: rgb(0,0,0, 0.4);
    box-shadow: 5px 5px 5px rgb(0,0,0,0.6);

    & + & {
        margin-left: 13%;
    }
`

const GridBox = React.memo(({ room }) => {
    return (
        <GridBoxBlock>
            {room}
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

const GridLayout = ({ list }) => {
    list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

    if(!list) return null;

    const gridArr = [];
    const rowSize = Math.floor(list.length / gridSize);
    for(let i=0; i<=rowSize; ++i) {
        gridArr.push(
            <GridRowBlock>
                {
                    list.splice(0, gridSize).map(room => (
                        <GridBox room={room} />
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