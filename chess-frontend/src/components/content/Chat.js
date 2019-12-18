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
    display : flex;
    flex-direction : column;
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

const MyMessageBlock = styled.div`
& {
    position: relative;
    align-self: flex-end;
    border-radius: 5px;
    padding : 5px;
    min-height : 20px;
    font-size : 15px;
    margin : 5px 20px 5px 5px;
    opacity : 0.7;
    transition: all 0.1s;
    border : 1px solid darkgray;
    background-color : ${({ color }) => color ? color : 'gray'};
    color : black;
    &:active {
            border : 3px solid darkblue;
        }
}
&::after{
    content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 1.094em solid transparent;
	border-left-color: ${({ color }) => color ? color : 'gray'};
	border-right: 0;
	border-bottom: 0;
	margin-top: -0.547em;
	margin-right: -1.094em;
}  
`;

const YourMessageBlock = styled.div`
&{
    align-self: flex-start;
    padding : 5px;
    border-radius: 5px;
    min-height : 20px;
    font-size : 15px;
    margin : 5px 5px 5px 20px;
    opacity : 0.7;
    transition: all 0.1s;
    background-color : lightgray;
    border : 1px solid darkgray;
    border : 1px solid darkgray;
    background-color : ${({ color }) => color ? color : 'gray'};
    &:active {
            border : 3px solid darkblue;
        }
}
&::after {
    content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 1.094em solid transparent;
	border-right-color: ${({ color }) => color ? color : 'gray'};
	border-left: 0;
	border-bottom: 0;
	margin-top: -0.547em;
	margin-left: -1.094em;
}

`;

const BroadcastBlock = styled.div`
    align-self: stretch;
    text-align: center;
    padding : 5px;
    border-radius: 5px;
    min-height : 20px;
    font-size : 15px;
    margin : 5px;
    opacity : 0.7;
    transition: all 0.1s;
    background-color : lightgray;
    border : 1px solid darkgray;
    border : 1px solid darkgray;
    background-color : ${({ color }) => color ? color : 'gray'};
    &:active {
            border : 3px solid darkblue;
        }
`;

const Message = React.memo(({ message, nickname, ...rest }) => {
    const MessageType = message.nickname
        ? message.nickname === nickname
            ? MyMessageBlock : YourMessageBlock : BroadcastBlock
    return (
        <MessageType
            {...rest}
            color={message.color}
        >
            {message.message}
        </MessageType>
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
                    <ChatBlock ref={ref}>
                        {messages.map(message => (
                            <Message
                                nickname={tempAuth.nickname}
                                message={message}
                            />
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