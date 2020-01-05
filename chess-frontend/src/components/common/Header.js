import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { IconContext } from 'react-icons';

import RoomModalContainer from '../../containers/modal/RoomModalContainer';

const HeaderBlock = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
`;

const titleStyle = css`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 40px;
    background-color: transparent;
    cursor: pointer;
    font-size: 30px;
    text-decoration: none;
    text-shadow: 2px 2px 2px rgb(0, 0, 0, 0.2);
    font-style: italic;
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
    align-items: center;
    margin-left: 8%;
`;

const GroupBlock = styled.div`
    margin-left: 30px;
    display: flex;
`;

const LetterBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 16px;
    cursor: pointer;
    color: rgb(0, 0, 0, 0.4);
    margin-left: 20px;
`;

const LetterLinkBlock = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 16px;
    cursor: pointer;
    color: rgb(0, 0, 0, 0.4);
    margin-left: 20px;
    text-decoration: none;
`;

const Letter = props => {
    if(props.to) {
        return (
            <LetterLinkBlock to={props.to}>
                {props.children}
            </LetterLinkBlock>
        )
    } else {
        return (
            <LetterBlock {...props}>
                {props.children}
            </LetterBlock>
        )
    }
}

const AuthBlock = styled.div`
    display: flex;
    align-items: center;
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
                    <GroupBlock>
                        <Letter onClick={onToggle}>
                            Play
                        </Letter>
                        <Letter to='/'>
                            Record
                        </Letter>
                        <Letter to='/community'>
                            Community
                        </Letter>
                    </GroupBlock>
                </ControllBlock>
                <AuthBlock>
                    <IconContext.Provider value={{
                        style:{
                            cursor: 'pointer',
                            width: '15px',
                            height: '15px'
                        }
                    }} >
                        <GoSearch />
                    </IconContext.Provider>
                    <Letter to='/login'>
                        Login
                    </Letter>
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