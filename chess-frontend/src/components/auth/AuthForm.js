import React from 'react';
import styled, { css } from 'styled-components';
import { IoMdMail } from 'react-icons/io';
import { FaLock } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';

const AuthFrameBlock = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 800px;
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
    text-shadow: 2px 2px 2px rgba(0,0,0,0.14);
`;

const InputFrameBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 150px;
`;

const InputFormBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    padding-left: 1%;
    width: 60%;

    &+& {
        margin-top: 10px;
    }
`

const inputStyle = css`
    outline: none;
    border: none;
    height: 40px;
    width: 80%;
    padding-left: 5%;
`;

const EmailInputBlock = styled.input`
    ${inputStyle}
`

const PasswordInputBlock = styled.input`
    ${inputStyle}
`;

const OptionFormBlock = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    width: 60%;
    height: 20px;
`;

const SaveInputFormBlock = styled.div`
    display: flex;
    align-content: center;
    width: 30%;
    height: 100%;
`;

const SaveInputBlock = styled.input`
    height: 100%;
    outline: none;
    margin: 0px;
`;

const SaveInputTextBlock = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 10px;
    color: rgb(0, 0, 0, 0.5);
    cursor: pointer;
    margin-left: 5px;
`;

const ForgetBlock = styled.div`
    font-size: 10px;
    color: rgb(0, 0, 0, 0.5);
    cursor: pointer;
`;

const SubmitFrameBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
`;

const SubmitBlock = styled.button`
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    border: none;
    outline: none;
    width: 30%;
    cursor: pointer;
    height: 40px;

    &:hover {
        background-color: rgb(0, 0, 0, 0.05);
    }
`;

const CreateFormBlock = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    height: 40px;
`;

const CreateBlock = styled.div`
    color: rgb(0, 0, 0, 0.5);
    font-size: 10px;
`;

const CreateButtonBlock = styled(Link)`
    outline: none;
    border: none;
    font-size: 10px;
    color: black;
    text-decoration: none;
    cursor: pointer;
    margin-left: 5px;
`;

const AuthForm = ({ login, register, onSubmit }) => {
    return (
        <AuthFrameBlock onSubmit={onSubmit}>
            <AuthFormBlock>
                <TitleBlock>
                    { login ? 'Sign In' : ( register ? 'Sign Up' : null ) }
                </TitleBlock>
                <InputFrameBlock>
                    <InputFormBlock>
                        <IconContext.Provider value={{ style: { width: '20px', height: '20px' } }}>
                            <IoMdMail />
                        </IconContext.Provider>
                        <EmailInputBlock
                            placeholder='Email'
                        />    
                    </InputFormBlock>
                    <InputFormBlock>
                        <IconContext.Provider value={{ style: { width: '20px', height: '20px' } }}>
                            <FaLock />
                        </IconContext.Provider>
                        <PasswordInputBlock
                            type='password'
                            placeholder='Password'
                        />
                    </InputFormBlock>
                    {register ? (
                        <InputFormBlock>
                        <IconContext.Provider value={{ style: { width: '20px', height: '20px' } }}>
                            <FaLock />
                        </IconContext.Provider>
                        <PasswordInputBlock
                            placeholder='Password Confirm'
                        />
                        </InputFormBlock>
                    ): null}
                    {login ? (
                        <OptionFormBlock>
                        <SaveInputFormBlock>
                            <SaveInputBlock
                                type='checkbox'
                            />
                            <SaveInputTextBlock>
                                Remember Me
                            </SaveInputTextBlock>
                        </SaveInputFormBlock>
                        <ForgetBlock>
                            Forget password?    
                        </ForgetBlock>
                        </OptionFormBlock>
                    ): null}
                </InputFrameBlock>
                <SubmitFrameBlock>
                    <SubmitBlock
                        type=''
                    >
                        Submit
                    </SubmitBlock>
                    {login ? (
                        <CreateFormBlock>
                            <CreateBlock>
                                Don't have an account?
                            </CreateBlock>
                            <CreateButtonBlock to='/register'>
                                Create
                            </CreateButtonBlock>
                        </CreateFormBlock>
                    ) : (
                        <CreateFormBlock>
                            <CreateBlock>
                                Don't have an account?
                            </CreateBlock>
                            <CreateButtonBlock to='/register'>
                                Create
                            </CreateButtonBlock>
                        </CreateFormBlock>
                    )}
                </SubmitFrameBlock>
            </AuthFormBlock>
        </AuthFrameBlock>
    )
};

export default AuthForm;