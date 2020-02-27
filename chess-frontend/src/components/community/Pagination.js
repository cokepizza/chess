import React from 'react';
import { MdArrowForward, MdArrowBack } from 'react-icons/md';
import { IconContext } from 'react-icons';
import styled, { css } from 'styled-components';

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
    
    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    &:active {
        background: rgba(0, 0, 0, 0.1);
    }

    ${props => props.page && css`
        background: rgba(102, 204, 255, 0.1);

        &:hover {
            background: rgba(102, 204, 255, 0.2);
        }

        &:active {
            background: rgba(102, 204, 255, 0.3);
        }
    }

    `}

    & + & {
        margin-left: 5px;
    }
`;

const Pagination = ({ page, size, onClick, onForwardClick, onBackwardClick }) => {
    const firstBlock = parseInt((page-1) / 5) * 5 + 1;
    const lastBlock = firstBlock + 4;
    
    const buttons = [];
    for(let i=firstBlock; i<=lastBlock; ++i) {
        buttons.push(
            <ButtonBlock
                page={i===page}
                onClick={() => onClick(i)}
                disabled={i > size}
            >
                {i}
            </ButtonBlock>
        );
    }

    return (
        <PaginationBlock>
            <ButtonBlock onClick={onBackwardClick}>
                <IconContext.Provider value={{ style: { width: '15px', height: '15px' } }}>
                    <MdArrowBack />
                </IconContext.Provider>
            </ButtonBlock>
            {buttons}
            <ButtonBlock onClick={onForwardClick}>
                <IconContext.Provider value={{ style: { width: '15px', height: '15px' } }}>
                    <MdArrowForward />
                </IconContext.Provider>
            </ButtonBlock>
        </PaginationBlock>
    )
};

export default React.memo(Pagination);