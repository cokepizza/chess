import React from 'react';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import { IconContext } from 'react-icons';
import styled from 'styled-components';

const PaginationBlock = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
`;


const ButtonBlock = styled.button`
    width: 30px;
    height: 30px;
    font-size: 10px;
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    padding: 0px;
    border: none;
    margin: 0px;
    outline: none;
    cursor: pointer;

    & + & {
        margin-left: 5px;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    &:active {
        background: rgba(0, 0, 0, 0.1);
    }
`;

const Pagination = ({ page, size, onClick, onForwardClick, onBackwardClick }) => {
    const firstBlock = parseInt((page-1) / 5) * 5 + 1;
    const lastBlock = firstBlock + 4;
    
    const buttons = [];
    for(let i=firstBlock; i<=lastBlock && i <= size; ++i) {
        buttons.push(
            <ButtonBlock onClick={() => onClick(i)}>
                {i}
            </ButtonBlock>
        );
    }

    return (
        <PaginationBlock>
            <ButtonBlock>
                <IconContext.Provider value={{ style: { width: '15px', height: '15px' } }}>
                    <MdArrowBack />
                </IconContext.Provider>
            </ButtonBlock>
            {buttons}
            <ButtonBlock>
                <IconContext.Provider value={{ style: { width: '15px', height: '15px' } }}>
                    <MdArrowForward />
                </IconContext.Provider>
            </ButtonBlock>
        </PaginationBlock>
    )
};

export default Pagination;