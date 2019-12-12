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

const MessageDiv = styled.div`
    padding : 5px;
    min-height : 20px;
    font-size : 15px;
    :nth-child(even) {
        color : black ;
    }
    :nth-child(odd) {
        color : blue ;
    }
    & + & {
        border-top :1px solid lightgrey;
    }
`;

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
                            <MessageDiv>{message}</MessageDiv>
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