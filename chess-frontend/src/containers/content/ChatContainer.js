import React from 'react';
import Chat from '../../components/content/Chat';

const ChatContainer = () => {
    const list = ['a','b','c','d'];
    
    return (
        <Chat list={list}/>
    )
};

export default ChatContainer;