import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebsocket, changeTextfield, initializeTextfield } from '../../modules/chat';
import { sendMessageThunk } from '../../modules/chat';
import Chat from '../../components/content/Chat';

const ChatContainer = () => {
    const dispatch = useDispatch();

    const { messages, text, tempAuth } = useSelector(({ chat, auth }) => ({
        messages: chat.messages,
        text: chat.text,
        tempAuth: auth.tempAuth,
    }));
    
    useEffect(() => {
        dispatch(connectWebsocket());
    }, [dispatch]);

    const onSubmit = useCallback(e => {
        e.preventDefault();
        dispatch(sendMessageThunk({ message: text }));
        dispatch(initializeTextfield());
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
            tempAuth={tempAuth}
        />
    )
};

export default ChatContainer;