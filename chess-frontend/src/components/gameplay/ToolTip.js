import React from 'react';
import styled from 'styled-components';

const ToolTipBlock = styled.div`
    position: absolute;
    top: -70px;
    left: 0px;
    height: 70px;
    width: 100px;
    display: flex;
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

`;

const ToolTip = ({ message }) => {
    let content;

    if(message) {
        content = (
            <MessageBlock>
                {message}
            </MessageBlock>
        )
    } else {
        content = (
            <div>
                haha
            </div>
        )
    }

    return (
        <ToolTipBlock>
            {content}
        </ToolTipBlock>
    )
};

export default ToolTip;