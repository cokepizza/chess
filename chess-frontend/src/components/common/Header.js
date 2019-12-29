import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import RoomModalContainer from '../../containers/modal/RoomModalContainer';

const RoomBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 50px;
    margin-left: 10px;
    background-color: white;
    cursor: pointer;
`;

const LinkBlock = styled(Link)`
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
    background-color: rgb(237,235,233);
`;

const Header = ({ onToggle, openModal, setOpenModal }) => {
    return (
        <>
            <HeaderBlock>
                <RoomBlock onClick={onToggle}>
                    Modal
                </RoomBlock>
                <LinkBlock to='/' />
            </HeaderBlock>
            <RoomModalContainer
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </>
    )
};

export default React.memo(Header);