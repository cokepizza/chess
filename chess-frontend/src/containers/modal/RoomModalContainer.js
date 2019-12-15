import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RoomModal from '../../components/modal/RoomModal';
import { disconnectWebsocket } from '../../modules/room';

const RoomModalContainer = ({ openModal, setOpenModal, ...rest }) => {
    const [ modal, setModal ] = useState(false);
    const { room } = useSelector(({ room }) => ({
        room: room.room,
    }));
    const dispatch = useDispatch();

    const onBackgroundClick = useCallback(e => {
        setModal(false);
        setOpenModal(false);
        dispatch(disconnectWebsocket());
    }, [setOpenModal])

    const onContentClick = useCallback(e => {
        e.stopPropagation();
    }, [])

    useEffect(() => {
        setModal(openModal);
        
    }, [openModal]);

    return (
        <>
            <RoomModal
                {...rest}
                room={room}
                open={modal}
                onBackgroundClick={onBackgroundClick}
                onContentClick={onContentClick}
            >
            </RoomModal>
        </>
    )
};

export default RoomModalContainer;