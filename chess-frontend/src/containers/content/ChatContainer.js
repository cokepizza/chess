import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTextfield, initializeTextfield } from '../../modules/chat';
import { sendMessageThunk } from '../../modules/chat';
import Chat from '../../components/content/Chat';

const ChatContainer = () => {
    const dispatch = useDispatch();

    const { socket, messages, text, tempAuth } = useSelector(({ chat, auth }) => ({
        socket: chat.socket,
        messages: chat.messages,
        text: chat.text,
        tempAuth: auth.tempAuth,
    }));

    const onSubmit = useCallback(e => {
        e.preventDefault();
        dispatch(sendMessageThunk({ socket, message: text }));
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