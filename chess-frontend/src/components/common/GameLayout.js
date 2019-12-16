import React from 'react';
import styled from 'styled-components';
import CanvasContainer from '../../containers/content/CanvasContainer';
import ChatContainer from '../../containers/content/ChatContainer';
import RecordContainer from '../../containers/content/RecordContainer';

const GameLayoutBlock = styled.div`
    height: 800px;
    width: 100%;
    background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatAndRecordBlock = styled.div`
    background-color: white;
    height: 90%;
    display: flex;
    flex-direction: column;
    margin-left: 80px;
    width: 25%;
`;

const GameLayout = props => {
    return (
        <GameLayoutBlock>
            <CanvasContainer {...props} />
            <ChatAndRecordBlock>
                <RecordContainer />
                <ChatContainer />
            </ChatAndRecordBlock>
        </GameLayoutBlock>
    )
};

export default React.memo(GameLayout);