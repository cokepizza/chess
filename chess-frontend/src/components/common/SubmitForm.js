import React from 'react';
import styled, { css } from 'styled-components';

const SubmitFormBlock = styled.form`
    display: flex;

`;

const buttonStyle = css`
    outline: none;
    background-color: #ccc;
    width: 200px;
    height: 30px;
    cursor: pointer;

    &:hover {
        background-color: black;
        color: white;
    }
`

const ConfirmButtonBlock = styled.button`
    ${buttonStyle}
`;

const CancelButtonBlock = styled.button`
    ${buttonStyle}
    margin-left: 20px;
`;

const SubmitForm = ({ onSubmit }) => {
    return (
        <SubmitFormBlock onSubmit={onSubmit}>
            <ConfirmButtonBlock type='submit'>
                Create Room
            </ConfirmButtonBlock>
            <CancelButtonBlock>
                Cancel
            </CancelButtonBlock>
        </SubmitFormBlock>
    )
};

export default React.memo(SubmitForm);