import React from 'react';
import styled, { css } from 'styled-components';
import CanvasContainer from '../../containers/content/CanvasContainer';
import ChatContainer from '../../containers/content/ChatContainer';
import RecordContainer from '../../containers/content/RecordContainer';

const GameLayoutBlock = styled.div`
    height: 800px;
    width: 100%;
    background-color: rgb(237, 235, 233);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const sideBlockStyle = css`
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 20%;
`;

const LeftSideBlock = styled.div`
    ${sideBlockStyle}
    margin-right: 1%;
`;

const RightSideBlock = styled.div`
    ${sideBlockStyle}
    margin-left: 1%;
`

const GameLayout = props => {
    return (
        <GameLayoutBlock>          
            <LeftSideBlock>
                <ChatContainer />
            </LeftSideBlock>
            <CanvasContainer {...props} />
            <RightSideBlock>
                <RecordContainer />
            </RightSideBlock>
        </GameLayoutBlock>
    )
};

export default React.memo(GameLayout);