import React from 'react';
import styled from 'styled-components';

const PaginationBlock = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
`;


const ButtonBlock = styled.button`
    width: 100px;
    height: 100%;
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

const Pagination = () => {
    return (
        <PaginationBlock>
            <ButtonBlock>
                0
            </ButtonBlock>
            <ButtonBlock>
                1
            </ButtonBlock>
            <ButtonBlock>
                2
            </ButtonBlock>
        </PaginationBlock>
    )
};

export default Pagination;