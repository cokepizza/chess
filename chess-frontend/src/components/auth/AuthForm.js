import React from 'react';
import styled, { css } from 'styled-components';
import { MdEmail } from 'react-icons/md';
import { IconContext } from 'react-icons';

const AuthFrameBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const AuthFormBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    height: 400px;
    background-color: rgba(255, 255, 255);
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const TitleBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 20px;
    height: 100px;
`;

const InputFormBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`

const inputStyle = css`
    outline: none;
    border: none;
    
    height: 40px;
    width: 80%;
    padding-left: 3%;
`;

const EmailInputBlock = styled.input`
    ${inputStyle}
`

const PasswordInputBlock = styled.input`
    ${inputStyle}
    margin-top: 10px;
`;


const AuthForm = ({ login, register }) => {
    return (
        <AuthFrameBlock>
            <AuthFormBlock>
                <TitleBlock>
                    { login ? 'Sign In' : ( register ? 'Sign Up' : null ) }
                </TitleBlock>
                <InputFormBlock>
                    <IconContext.Provider value={{ style: { width: '30px', height: '30px' } }}>
                        <MdEmail />
                    </IconContext.Provider>
                    <EmailInputBlock/>    
                </InputFormBlock>
                <PasswordInputBlock />
            </AuthFormBlock>
        </AuthFrameBlock>
    )
};

export default AuthForm;