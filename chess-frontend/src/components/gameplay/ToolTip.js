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
    ${props => props.role && css`
        top: -70px;
        opacity: 1;
        visibility: visible;
    `}
    ${props => props.message && css`
        transition: 2s;
        transition-timing-function: ease-in;
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
    width: 30px;
    height: 30px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;

    &+& {
        margin-left: 1px solid black;
        
    }
`;

const ToolTip = ({ type, message, role }) => {
    let content;

    if(message) {
        if(role === 'ask') {
            content = (
                <MessageBlock>
                    {message}
                </MessageBlock>
            );
        } else if(role === 'answer') {
            content = (
                <MessageBlock>
                    <ButtonBlock>
                        Y
                    </ButtonBlock>
                    <ButtonBlock>
                        N
                    </ButtonBlock>
                </MessageBlock>
            )
        }
    } else {
        content = (
            <SpinnerFrameBlock>
                <SpinnerBlock src={Spinner} />
            </SpinnerFrameBlock>
        )
    }

    return (
        <ToolTipBlock
            message={message}
            role={role}
        >
            <TitleBlock>
                {type}
            </TitleBlock>
            {content}
        </ToolTipBlock>
    )
};

export default ToolTip;