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
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.07), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.06); */
    /* border-bottom: 1px solid #ccc; */
    display: flex;
    cursor: pointer;
    transition: 1s;
    
    top: ${props => (props.index * 41 + 42) + 'px'};
    /* top: ${props => (props.index * 50) + 'px'}; */
    left: 0;

    background-color: rgba(255, 255, 255, 0.2);
    /* background-color: blue;
    z-index: 1000; */
    &:hover {
        background-color: rgba(255, 255, 255, 0.5);
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

    ${props => props.name && css`
        width: 240px;
        justify-content: flex-start;
    `}

`;

const ListCell = React.memo(({ cell }) => {
    return (
        <ListCellBlock index={cell.index}>
            <TextBlock>
                {cell.index + 1}
            </TextBlock>
            <TextBlock name>
                {cell.username}
            </TextBlock>
            <TextBlock elo>
                {cell.elo}
            </TextBlock>
            <TextBlock>
                {cell.ratio * 100} %
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

const List = ({ list }) => {
    console.dir(list);
    const listArr = list && list
        .map(cell => (
                <ListCell
                    key={cell.username}
                    cell={cell}
                />
            )
        );
    
    const leng = list && list.length;
    const borderArr = [];
    if(leng) {
        for(let i=1; i<leng; ++i) {
            borderArr.push(
                <BorderBlock index={i}/>
            )
        }
    }

    return (
        <ListBlock>
            {listArr}
            {borderArr}
        </ListBlock>
    )
};

export default React.memo(List);