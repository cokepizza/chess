import React, { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { IoIosSend } from 'react-icons/io';
import { IconContext } from 'react-icons';

const ChatSubmitBlock = styled.form`
`;

const ChatFrameBlock = styled.div`
    position: relative;
    background-color: white;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const ChatHiddenBlock = styled.div`
    height: 360px;
    width: 100%;
    overflow: hidden;
`;

const ChatBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 360px;
    width: 100%;
    padding-right: 20px;
    overflow-y: overlay;
`;

const ChatFormBlock = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    background-color: white;
    box-shadow: rgba(0,0,0,0.05) 0px -2px 2px 0px, rgba(0,0,0,0.08) 0px -3px 1px -2px, rgba(0,0,0,0.04) 0px -1px 5px 0px;
`;

const ChatInputBlock = styled.input`
    outline: none;
    border: none;
    align-items : center;
    color: black;
    background-color: transparent;
    font-size: 12px;
    width: 80%;
    height : 30px;
    padding-left: 10px;
`;

const ChatButtonBlock = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
    font-size: 12px;
    background-color: rgb(247,246,245);
    border: none;
    cursor: pointer;

    &:hover, &:focus {
        background-color: #D3D3D3;
    } 
`;

const MessageBlock = styled.div`
    display: flex;
    align-items: center;
    width: 90%;
    height : 30px;
    min-height : 30px;
    font-size : 12px;
    background-color: white;

    ${props => props.owner === 'my' && css`
        justify-content: flex-end;
    `};

    ${props => props.owner === 'other' && css`
        justify-content: flex-start;
    `};

    ${props => props.owner === 'server' && css`
        justify-content: center;
    `};
`;

const Message = React.memo(({ message, myName, ...rest }) => {
    const owner = message.nickname ? (message.nickname === myName ? 'my' : 'other') : 'server';
    const text = owner === 'other' ? message.nickname + ' : ' + message.message : message.message;

    return (
        <MessageBlock
            {...rest} 
            color={message.color}
            owner={owner}
        >
            {text}
        </MessageBlock>
    )
});

const Chat = ({ messages, onSubmit, onChange, text, tempAuth }) => {
    const ref = useRef();
    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages]);

    return (
        <>
            <ChatSubmitBlock onSubmit={onSubmit}>
                <ChatFrameBlock>
                    <ChatHiddenBlock>
                        <ChatBlock ref={ref}>
                            {messages.map(message => (
                                <Message
                                    myName={tempAuth.nickname}
                                    message={message}
                                />
                            ))}
                        </ChatBlock>
                    </ChatHiddenBlock>
                    <ChatFormBlock>
                        <ChatInputBlock
                            onChange={onChange}
                            value={text}
                        />
                        <ChatButtonBlock
                            onSubmit={onSubmit}
                        >
                            <IconContext.Provider value={{style: { width:'40%', height:'40%' }}}>
                                <IoIosSend />
                            </IconContext.Provider>
                        </ ChatButtonBlock>
                    </ChatFormBlock>
                </ChatFrameBlock>
            </ChatSubmitBlock>
        </>
    )
};

export default React.memo(Chat);