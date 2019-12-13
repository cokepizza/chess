import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from '../../components/content/Chat';
import { initializeWebsocket, changeTextfield, initializeTextfield } from '../../modules/chat';
import { sendMessageThunk } from '../../modules/chat';
import { setSessionThunk } from '../../modules/auth';

const ChatContainer = () => {
    const dispatch = useDispatch();

    const { messages, text, tempAuth } = useSelector(({ chat, auth }) => ({
        messages: chat.messages,
        text: chat.text,
        tempAuth: auth.tempAuth,
    }));
    
    useEffect(() => {
        (async () => {
            await dispatch(setSessionThunk());
            dispatch(initializeWebsocket());
        })();
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