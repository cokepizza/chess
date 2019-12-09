import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../../components/content/Chat';
import { initializeWebsocket } from '../../modules/chat';

const ChatContainer = () => {
    const list = ['a','b','c','d'];
    const dispatch = useDispatch();

    const { message } = useSelector(({ chat }) => ({
        message: chat.message,
    }));

    useEffect(() => {
        dispatch(initializeWebsocket());
    }, [dispatch]);

    return (
        <Chat list={list} message={message}/>
    )
};

export default ChatContainer;