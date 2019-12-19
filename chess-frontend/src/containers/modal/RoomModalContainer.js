import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoomModal from '../../components/modal/RoomModal';
import { disconnectWebsocket as disconnectRoomWebsocket } from '../../modules/room';
    
const RoomModalContainer = ({ history, openModal, setOpenModal, ...rest }) => {
    const [ modal, setModal ] = useState(false);
    const { room } = useSelector(({ room }) => ({
        room: room.room,
    }));
    const dispatch = useDispatch();

    const onBackgroundClick = useCallback(e => {
        setModal(false);
        setOpenModal(false);
        dispatch(disconnectRoomWebsocket());
    }, [dispatch, setOpenModal])

    const onContentClick = useCallback(e => {
        e.stopPropagation();
    }, [])

    const onRoomClick = useCallback((e, key) => {
        setModal(false);
        setOpenModal(false);
        dispatch(disconnectRoomWebsocket());
        history.push(`/game/${key}`);
    }, [dispatch, history, setOpenModal]);

    useEffect(() => {
        setModal(openModal);
    }, [openModal]);

    // useEffect(() => {
    //     return () => {
    //         dispatch(disconnectRoomWebsocket());
    //     }
    // })

    return (
        <>
            <RoomModal
                {...rest}
                room={room}
                open={modal}
                onBackgroundClick={onBackgroundClick}
                onContentClick={onContentClick}
                onRoomClick={onRoomClick}
            >
            </RoomModal>
        </>
    )
};

export default withRouter(RoomModalContainer);