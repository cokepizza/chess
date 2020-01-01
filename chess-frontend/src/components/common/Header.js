import React from 'react';
import styled, { css } from 'styled-components';
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

const HeaderBlock = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: rgb(237,235,233);
`;

const titleStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: transparent;
    cursor: pointer;
    font-size: 30px;
    text-decoration: none;
    text-shadow: 2px 2px 2px rgb(0, 0, 0, 0.2);
`;

const TitleBlock = styled(Link)`
    ${titleStyle}
    color: rgb(0, 0, 0, 0.6);
`;

const TitleFadeBlock = styled(Link)`
    ${titleStyle}
    color: rgb(0, 0, 0, 0.4);
`;

const ControllBlock = styled.div`
    display: flex;
    margin-left: 8%;

`;


const AuthBlock = styled.div`
    margin-right: 8%;

`;

const Header = ({ onToggle, openModal, setOpenModal }) => {
    return (
        <>
            <HeaderBlock>
                <ControllBlock>
                    <TitleBlock to='/'>
                        chessup
                    </TitleBlock>
                    <TitleFadeBlock to='/'>
                        .com
                    </TitleFadeBlock>
                    
                    <RoomBlock onClick={onToggle}>
                        Modal
                    </RoomBlock>
                </ControllBlock>
                <AuthBlock>
                    
                </AuthBlock>
            </HeaderBlock>
            <RoomModalContainer
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </>
    )
};

export default React.memo(Header);