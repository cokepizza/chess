import React, { useState, useCallback } from 'react';
import Header from '../../components/common/Header';
import RoomModalContainer from '../../containers/modal/RoomModalContainer';

//  namespace 분리 예정
//  list(리스트 보는 중), game(게임 중)

const HeaderContainer = () => {
    const [ openModal, setOpenModal ] = useState(false);

    const onToggle = useCallback(() => {
        setOpenModal(true);
    }, []);

    return (
        <>
            <Header
                onToggle={onToggle}
            />
            <RoomModalContainer
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </>
    );
};

export default HeaderContainer;