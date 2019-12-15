import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { connectWebsocket } from '../../modules/room';

const HeaderContainer = () => {
    const [ openModal, setOpenModal ] = useState(false);
    const dispatch = useDispatch();

    const onToggle = useCallback(() => {
        setOpenModal(true);
        dispatch(connectWebsocket());
    }, [dispatch]);

    return (
        <Header
            onToggle={onToggle}
            openModal={openModal}
            setOpenModal={setOpenModal}
        />
    );
};

export default HeaderContainer;