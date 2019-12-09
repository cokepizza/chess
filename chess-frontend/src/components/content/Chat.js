import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatFrameBlock = styled.div`
    width: 300px;
`;

const ChatBlock = styled.div`
    height: 500px;
    border: 1px solid black;
    overflow-y: scroll;
`;

const ChatFormBlock = styled.div`
    width: 100%;
    display: flex;
    padding: 1px;
`;

const ChatInputBlock = styled.input`
    outline: none;
    width: 80%;
`;

const ChatButtonBlock = styled.button`
    width: 20%;
`;

const Chat = ({ messages, onSubmit, onChange, text }) => {
    const ref = useRef();

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages]);

    return (
        <>
            <form onSubmit={onSubmit}>
                <ChatFrameBlock>
                    <ChatBlock ref={ref}>
                        {messages.map(message => (
                            <div>{message}</div>
                        ))}
                    </ChatBlock>
                    <ChatFormBlock>
                        <ChatInputBlock
                            onChange={onChange}
                            value ={text}
                        />
                        <ChatButtonBlock
                            onSubmit={onSubmit}
                        >
                            보내기
                        </ ChatButtonBlock>
                    </ChatFormBlock>
                </ChatFrameBlock>
            </form>
        </>
    )
};

export default React.memo(Chat);