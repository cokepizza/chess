import React from 'react';
import styled from 'styled-components';

const ChatBlock = styled.div`
    width: 300px;
    height: 500px;
    border: 1px solid black;
`;

const Chat = ({ list }) => {
    list = ['a','b','c','d'];
    
    return (
        <ChatBlock>
            {list.map((sentence, index) => (
                <div>{index} : {sentence}</div>
            ))}
        </ChatBlock>
    )
};

export default Chat;