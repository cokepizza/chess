import React from 'react';
import styled from 'styled-components';
import RoomModalContainer from '../../containers/modal/RoomModalContainer';

const RoomBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 30px;
    margin-left: 10px;
    background-color: white;
    cursor: pointer;
`;

const HeaderBlock = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: red;
`;

const Header = ({ onToggle, openModal, setOpenModal }) => {
    return (
        <>
            <HeaderBlock>
                <RoomBlock
                    onClick={onToggle}
                >
                    Modal
                </RoomBlock>
            </ HeaderBlock>
            <RoomModalContainer
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </>
    )
};

export default React.memo(Header);