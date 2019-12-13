// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatSubmitBlock = styled.form`
`;

const ChatFrameBlock = styled.div`
    margin: 10px 10px 10px 10px;
    border : 3px groove gray;
    border-style: outset;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    width: 450px;
    box-shadow: 5px 5px 5px;
`;

const ChatBlock = styled.div`
    height: 300px;
    margin: 10px 10px 10px 10px;
    border : none;
    overflow-y: scroll;
    background-image: url('https://previews.123rf.com/images/vilisov/vilisov1502/vilisov150200012/36207194-chess-board-abstract-background.jpg'); 
    background-size: cover;
    ::-webkit-scrollbar {
        width: 20px;
    }
    ::-webkit-scrollbar-track {
        color: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background-color: lightgray;
        border-radius: 10px;
    }
`;

const ChatFormBlock = styled.div`
    width: 100%;
    display: flex;
    padding: 1px;
`;

const ChatInputBlock = styled.input`
    outline: none;
    align-items : center;
    color: black;
    font-size: 15px;
    margin : 10px 10px 10px 10px;
    width: 80%;
    height : 30px;
    border: 3px solid lightgray;
    transition: all 0.3s ease .1s;
    &:hover, &:focus {
        border: 3px solid gray;
    } 
`;

const ChatButtonBlock = styled.button`
    width: 20%;
    font-size: 15px;
    margin : 10px 10px 10px 10px;
    background-color: transparent;
    border: 3px solid lightgray;
    transition: all 0.3s ease .1s;
    &:hover, &:focus {
        border: 3px solid gray;
    } 
`;

const MessageBlock = styled.div`
  padding : 5px;
    min-height : 20px;
    font-size : 15px;
    margin : 5px;
    opacity : 0.7;
    transition: all 0.1s;
    :nth-child(even) {
        color : black ;
        border : 1px solid darkgray;
        background-color : lightgray;
        &:active {
            border : 3px solid darkblue;
        }
    }
    :nth-child(odd) {
        color : blue ;
        border : 1px solid gray;
        background-color : lightgray;
        &:active {
            border : 3px solid darkblue;
        }
    }
    color: ${props => props.color ? props.color : null};
`;

const Message = React.memo(({ message, ...rest }) => {
    return (
        <MessageBlock {...rest} color={message.color}>
            {message.message}
        </MessageBlock>
    )
});

const Chat = ({ messages, onSubmit, onChange, text }) => {
    const ref = useRef();
    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages]);

    return (
        <>
            <ChatSubmitBlock onSubmit={onSubmit}>
                <ChatFrameBlock>
                    <ChatBlock ref={ref}>
                        {messages.map(message => (
                            <Message message={message} />
                        ))}
                    </ChatBlock>
                    <ChatFormBlock>
                        <ChatInputBlock
                            onChange={onChange}
                            value={text}
                        />
                        <ChatButtonBlock
                            onSubmit={onSubmit}
                        >
                            Send
                        </ ChatButtonBlock>
                    </ChatFormBlock>
                </ChatFrameBlock>
            </ChatSubmitBlock>
        </>
    )
};

export default React.memo(Chat);