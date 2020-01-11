import React from 'react';
import styled, { css } from 'styled-components';
import CanvasContainer from '../../containers/gameplay/CanvasContainer';
import ChatContainer from '../../containers/gameplay/ChatContainer';
import RecordContainer from '../../containers/gameplay/RecordContainer';

const GamePlayLayoutBlock = styled.div`
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
`;

const GamePlayLayout = () => {
    return (
        <GamePlayLayoutBlock>
            <LeftSideBlock>
                <ChatContainer />
            </LeftSideBlock>
            <CanvasContainer />
            <RightSideBlock>
                <RecordContainer />
            </RightSideBlock>
        </GamePlayLayoutBlock>
    )
};

export default React.memo(GamePlayLayout);