import React from 'react';
import styled from 'styled-components';

const CreationBlock = styled.div`
    width: 300px;
    height: 400px;
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const ConfirmBlock = styled.button`
    width: 300px;
    height: 100px;
    cursor: pointer;
    border: none;
    outline: none;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`

const Creation = ({ onSubmit }) => {
    return (
        <CreationBlock>
            <ConfirmBlock onClick={onSubmit}>
                Create
            </ConfirmBlock>
        </CreationBlock>
    )
};

export default React.memo(Creation);