import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { readRoomThunk } from '../../modules/room';

const HeaderContainer = () => {
    const [ openModal, setOpenModal ] = useState(false);
    const dispatch = useDispatch();
    const onToggle = useCallback(() => {
        setOpenModal(true);
        dispatch(readRoomThunk());
    }, []);

    return (
        <Header
            onToggle={onToggle}
            openModal={openModal}
            setOpenModal={setOpenModal}
        />
    );
};

export default HeaderContainer;