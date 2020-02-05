import React from 'react';
import styled, { css } from 'styled-components';

const ListBlock = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 10;
`;

const ListCellBlock = styled.div`
    position: absolute;
    height: 40px;
    width: 100%;
    display: flex;
    cursor: pointer;
    transition: 1s top;
    top: ${props => (props.index * 41 + 42) + 'px'};
    left: 0;

    &:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }
    
`;

const TextBlock = styled.div`
    width: 100px;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;

    ${props => props.elo && css`
        width: 120px;
    `}

    ${props => props.mail && css`
        width: 240px;
        justify-content: flex-start;
    `}

    ${props => props.header && css`
        justify-content: center;
    `};

`;
// {cell.ratio * 100} %
const ListCell = React.memo(({ cell }) => {
    return (
        <ListCellBlock index={cell.index}>
            <TextBlock>
                {cell.index + 1}
            </TextBlock>
            <TextBlock mail>
                {cell.username}
            </TextBlock>
            <TextBlock elo>
                {cell.elo}
            </TextBlock>
            <TextBlock>
                {cell.ratio}
            </TextBlock>
            <TextBlock>
                {cell.win}
            </TextBlock>
            <TextBlock>
                {cell.lose}
            </TextBlock>
        </ListCellBlock>
    )
});

const BorderBlock = styled.div`
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #ccc;
    top: ${props => (props.index * 41 - 1 + 42) + 'px'};
    left: 0;
`;

const HeaderCell = React.memo(() => {
    return (
        <HeaderCellBlock>
            <TextBlock>
                Rank
            </TextBlock>
            <TextBlock mail={true} header={true}>
                Email
            </TextBlock>
            <TextBlock elo={true}>
                Elo
            </TextBlock>
            <TextBlock>
                Ratio
            </TextBlock>
            <TextBlock>
                Win
            </TextBlock>
            <TextBlock>
                Lose
            </TextBlock>
        </HeaderCellBlock>
    )
});

const HeaderCellBlock = styled.div`
    position: absolute;
    display: flex;
    height: 40px;
    width: 100%;
    border-bottom: 2px solid rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
`;

const List = ({ list }) => {
    const listArr = list && list
        .map(cell => (
                <ListCell
                    key={cell.username}
                    cell={cell}
                />
            )
        );

    const borderArr = [];
    if(list) {
        const leng = list.reduce((acc, cur) => {
            return acc + (cur.index < 15 ? 1 : 0);
        }, 0);
        
        for(let i=1; i<leng; ++i) {
            borderArr.push(
                <BorderBlock
                    key={`border_${i}`}
                    index={i}
                />
            )
        }
    }

    return (
        <ListBlock>
            <HeaderCell />
            {listArr}
            {borderArr}
        </ListBlock>
    )
};

export default React.memo(List);