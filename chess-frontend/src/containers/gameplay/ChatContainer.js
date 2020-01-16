import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeTextfield, initializeTextfield } from '../../modules/chat';
import { sendMessageThunk, clearValue } from '../../modules/chat';
import Chat from '../../components/gameplay/Chat';

const ChatContainer = () => {
    const dispatch = useDispatch();

    const { socket, messages, text, nickname } = useSelector(({ chat, socketAuth }) => ({
        socket: chat.socket,
        messages: chat.messages,
        text: chat.text,
        nickname: socketAuth.nickname,
    }));

    const onSubmit = useCallback(e => {
        e.preventDefault();
        dispatch(sendMessageThunk({ socket, message: text }));
        dispatch(initializeTextfield());
    }, [dispatch, text, socket]);

    const onChange = useCallback(e => {
        dispatch(changeTextfield(e.target.value));
    },[dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

    return (
        <Chat
            messages={messages}
            onSubmit={onSubmit}
            onChange={onChange}
            text={text}
            nickname={nickname}
        />
    )
};

export default ChatContainer;