import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { connectWebsocket } from '../../modules/room';
import { logoutThunk } from '../../modules/auth';

const HeaderContainer = () => {
    const { session, auth } = useSelector(({ auth }) => ({
        session: auth.session,
        auth: auth.auth,
    }));
    const dispatch = useDispatch();

    const [ openModal, setOpenModal ] = useState(false);

    const onToggle = useCallback(() => {
        setOpenModal(true);
        dispatch(connectWebsocket());
    }, [dispatch]);

    const onLogout = useCallback(() => {
        dispatch(logoutThunk());
    }, [dispatch]);

    return (
        <Header
            onToggle={onToggle}
            openModal={openModal}
            setOpenModal={setOpenModal}
            onLogout={onLogout}
            session={session}
            auth={auth}
        />
    );
};

export default HeaderContainer;