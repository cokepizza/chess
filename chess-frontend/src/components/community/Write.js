import React from 'react';
import styled from 'styled-components';

const WriteBlock = styled.div`

`;

const TitleBlock = styled.div`

`;

const ContentBlock = styled.div`

`;

const Write = ({ write }) => {
    return (
        <WriteBlock>
            <TitleBlock>{write.title}</TitleBlock>
            <ContentBlock>{write.content}</ContentBlock>
        </WriteBlock>
    );
};

export default Write;