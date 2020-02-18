import React from 'react';
import styled from 'styled-components';

const BulletinLayoutBlock = styled.div`

`;

const ContentBlock = styled.div`

`;

const BulletinLayout = ({ list }) => {
    return (
        <BulletinLayoutBlock>
            {list && list.summary.map(title => (
                <ContentBlock>
                    {title}
                </ContentBlock>
            ))}
        </BulletinLayoutBlock>
    );
};

export default BulletinLayout;