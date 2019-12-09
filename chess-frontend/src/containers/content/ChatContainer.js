import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../../components/content/Chat';
import { initializeWebsocket, changeTextfield } from '../../modules/chat';
import { sendMessageThunk } from '../../modules/chat';

const ChatContainer = () => {
    const dispatch = useDispatch();

    const { messages, text } = useSelector(({ chat }) => ({
        messages: chat.messages,
        text: chat.text,
    }));
    
    useEffect(() => {
        dispatch(initializeWebsocket());
    }, [dispatch]);

    const onSubmit = useCallback(e => {
        e.preventDefault();
        dispatch(sendMessageThunk({ message: text }));
    }, [dispatch, text]);

    const onChange = useCallback(e => {
        dispatch(changeTextfield(e.target.value));
    },[dispatch]);

    return (
        <Chat
            messages={messages}
            onSubmit={onSubmit}
            onChange={onChange}
            text={text}
        />
    )
};

export default ChatContainer;