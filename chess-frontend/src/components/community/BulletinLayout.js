import React from 'react';
import styled from 'styled-components';

const BulletinLayoutBlock = styled.div`

`;

const ContentBlock = styled.div`

`;

const BulletinLayout = ({ board }) => {
    return (
        <BulletinLayoutBlock>
            {board && board.content.map(content => (
                <ContentBlock>
                    {content}
                </ContentBlock>
            ))}
        </BulletinLayoutBlock>
    );
};

export default BulletinLayout;