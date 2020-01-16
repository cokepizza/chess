import React, { useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { IoMdMail } from 'react-icons/io';
import { FaLock } from 'react-icons/fa';
import { IconContext } from 'react-icons';

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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    padding-left: 1%;
    width: 60%;

    &+& {
        margin-top: 10px;
    }

    @keyframes blinking {
        0%{
            box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
        }
        50% {
            box-shadow:0 2px 2px 0 rgba(0,0,0,0.56), 0 3px 1px -2px rgba(0,0,0,0.8), 0 1px 5px 0 rgba(0,0,0,0.48);
        }
        100%{
            box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
        }
      }

    ${props => props.blink && css`
        animation: blinking 1s 2;
    `}
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
    background-color: transparent;

    &:hover, :active {
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

const CreateButtonBlock = styled.button`
    outline: none;
    border: none;
    font-size: 10px;
    color: black;
    text-decoration: none;
    cursor: pointer;
    margin-left: 5px;
    background-color: transparent;
`;

const ErrorBlock = styled.div`
    position: absolute;
    top: 0;
    left: 48%;
    width: 50%;
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    @keyframes fontOpacity {
        0%{
            color: rgb(0, 0, 0, 0);
        }
        100%{
            color: rgb(0, 0, 0, 0.4);
        }
      }
    animation: fontOpacity 1s 1;
    color: rgb(0, 0, 0, 0.4);
`

const AuthForm = ({ login, register, form, error, onSubmit, onChange, onRegister }) => {
    const ref = useRef({});

    const onClick = useCallback(tag => {
        ref.current[tag].focus();
    }, []);

    return (
        <AuthFrameBlock
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            onSubmit={onSubmit}
        >
            <AuthFormBlock>
                <TitleBlock>
                    { login ? 'Sign In' : ( register ? 'Sign Up' : null ) }
                </TitleBlock>
                <InputFrameBlock>
                    <InputFormBlock
                        onClick={onClick.bind(null, 'username')}
                        blink={error.username}
                        key={`username_${error.count}`}
                    >
                        <IconContext.Provider value={{ style: { width: '20px', height: '20px', cursor: 'pointer'} }}>
                            <IoMdMail />
                        </IconContext.Provider>
                        <EmailInputBlock
                            type='text'
                            name='username'
                            placeholder='Email'
                            onChange={onChange}
                            value={form.username}
                            ref={el => ref.current.username = el}
                        />
                        <ErrorBlock>
                            {error.username}
                        </ErrorBlock>
                    </InputFormBlock>
                    <InputFormBlock
                        onClick={onClick.bind(null, 'password')}
                        blink={error.password}
                        key={`password_${error.count}`}
                    >
                        <IconContext.Provider value={{ style: { width: '20px', height: '20px', cursor: 'pointer' } }}>
                            <FaLock />
                        </IconContext.Provider>
                        <PasswordInputBlock
                            type='password'
                            name='password'
                            placeholder='Password'
                            onChange={onChange}
                            value={form.password}
                            ref={el => ref.current.password = el}
                        />
                        <ErrorBlock>
                            {error.password}
                        </ErrorBlock>
                    </InputFormBlock>
                    {register ? (
                        <InputFormBlock
                            onClick={onClick.bind(null, 'passwordConfirm')}
                            blink={error.passwordConfirm}
                            key={`passwordConfirm_${error.count}`}
                        >
                            <IconContext.Provider value={{ style: { width: '20px', height: '20px', cursor: 'pointer' } }}>
                                <FaLock />
                            </IconContext.Provider>
                            <PasswordInputBlock
                                type='password'
                                name='passwordConfirm'
                                placeholder='Confirm Password'
                                onChange={onChange}
                                value={form.passwordConfirm}
                                ref={el => ref.current.passwordConfirm = el}
                            />
                            <ErrorBlock>
                                {error.passwordConfirm}
                            </ErrorBlock>
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
                        type='submit'
                    >
                        Submit
                    </SubmitBlock>
                    {login ? (
                        <CreateFormBlock>
                            <CreateBlock>
                                Don't have an account?
                            </CreateBlock>
                            <CreateButtonBlock
                                type='button'
                                onClick={onRegister}
                            >
                                Create
                            </CreateButtonBlock>
                        </CreateFormBlock>
                    ) : (
                        <CreateFormBlock>
                            <CreateBlock>
                                Don't have an account?
                            </CreateBlock>
                            <CreateButtonBlock
                                type='button'
                            >
                                Create
                            </CreateButtonBlock>
                        </CreateFormBlock>
                    )}
                </SubmitFrameBlock>
            </AuthFormBlock>
        </AuthFrameBlock>
    )
};

export default React.memo(AuthForm);