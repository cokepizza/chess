import React, { useState, useCallback, useEffect } from 'react';
import RoomModal from '../../components/modal/RoomModal';

const RoomModalContainer = ({ openModal, setOpenModal, ...rest }) => {
    const [ modal, setModal ] = useState(false);
    
    const onBackgroundClick = useCallback(e => {
        setModal(false);
        setOpenModal(false);
    }, [setOpenModal])

    const onContentClick = useCallback(e => {
        e.stopPropagation();
    }, [])

    useEffect(() => {
        setModal(openModal);
    }, [openModal]);

    useEffect(() => {
        
    });

    return (
        <>
            <RoomModal
                {...rest}
                open={modal}
                onBackgroundClick={onBackgroundClick}
                onContentClick={onContentClick}
            >
            </RoomModal>
        </>
    )
};

export default RoomModalContainer;