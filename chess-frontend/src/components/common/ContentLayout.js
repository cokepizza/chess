import React from 'react';
import styled from 'styled-components';
import CanvasContainer from '../../containers/CanvasContainer';
import Chat from '../../components/content/Chat';
import Record from '../../components/content/Record';

const ContentLayoutBlock = styled.div`
    height: 800px;
    width: 100%;
    background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatAndRecordBlock = styled.div`
    height: 90%;
    background-color: green;
    display: flex;
    flex-direction: column;
    margin-left: 80px;
    width: 25%;
`;

const ContentLayout = props => {
    return (
        <ContentLayoutBlock>
            <CanvasContainer {...props} />
            <ChatAndRecordBlock>
                <Record />
                <Chat />
            </ChatAndRecordBlock>
        </ContentLayoutBlock>
    )
};

export default ContentLayout;