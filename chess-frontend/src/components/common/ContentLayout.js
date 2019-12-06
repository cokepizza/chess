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

const ContentLayout = props => {
    return (
        <ContentLayoutBlock>
            <CanvasContainer {...props} />
            <Chat />
            <Record />
        </ContentLayoutBlock>
    )
};

export default ContentLayout;