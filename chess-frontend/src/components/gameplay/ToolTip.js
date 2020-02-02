import React from 'react';
import styled, { css } from 'styled-components';

import Spinner from '../../static/image/spinner.svg';

const ToolTipBlock = styled.div`
    position: absolute;
    top: -90px;
    left: 0px;
    height: 60px;
    width: 84px;
    opacity: 0;
    visibility: hidden;
    ${props => props.modal && css`
        top: -70px;
        opacity: 1;
        visibility: visible;
    `}
    ${props => props.message && css`
        transition: all 3s cubic-bezier(1.000, 0.015, 1.000, 0.030);
        top: -90px;
        opacity: 0;
    `}
    transition: 1s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
`;

const MessageBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 11px;
`;

const SpinnerFrameBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
`;

const SpinnerBlock = styled.img`
    height: 30px;
    width: 30px;
`;

const TitleBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    height: 20px;
    width: 100%;
`;

const ButtonBlock = styled.button`
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    width: 30px;
    height: 30px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;

    ${props => props.restrict && css`
        pointer-events: none;
    `}

    &+& {
        margin-left: 10px;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

const TimeLineBlock = styled.div`
    position: absolute;
    top: -2px;
    left: 0px;
    width: 84px;
    height: 2px;
    background-color: blue;
    visibility: hidden;
    ${props => props.race && css`
        visibility: visible;
        transition: all 5s linear;
        width: 0px;
    `}
`;

const ToolTip = ({ type, message, modal, race, restrict, onClick }) => {
    let content;

    if(modal === 'answer') {
        content = (
            <MessageBlock>
                <ButtonBlock
                    restrict={restrict}
                    onClick={() => onClick(true)}
                >
                    Y
                </ButtonBlock>
                <ButtonBlock
                    restrict={restrict}
                    onClick={() => onClick(false)}
                >
                    N
                </ButtonBlock>
            </MessageBlock>
        )
    } else if(modal === 'ask') {
        if(message) {
            content = (
                <MessageBlock>
                    {message}
                </MessageBlock>
            );
        } else {
            content = (
                <SpinnerFrameBlock>
                    <SpinnerBlock src={Spinner} />
                </SpinnerFrameBlock>
            )
        }
    }

    return (
        <ToolTipBlock
            message={message}
            modal={modal}
        >
            <TimeLineBlock race={race} />
            <TitleBlock>
                {type}
            </TitleBlock>
            {content}
        </ToolTipBlock>
    )
};

export default ToolTip;