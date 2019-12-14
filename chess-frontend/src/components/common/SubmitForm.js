import React from 'react';
import styled from 'styled-components';

const SubmitFormBlock = styled.form`
    display: flex;

`;

const ConfirmButtonBlock = styled.button`
    outline: none;
    width: 10%;
    height: 30px;

`;

const CancelButtonBlock = styled.button`
    outline: none;
    width: 10%;
    height: 30px;
`;

const SubmitForm = ({ onSubmit }) => {
    return (
        <SubmitFormBlock onSubmit={onSubmit}>
            <ConfirmButtonBlock type='submit' />
            <CancelButtonBlock />
        </SubmitFormBlock>
    )
};

export default React.memo(SubmitForm);