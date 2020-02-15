import React from 'react';
import styled, { css } from 'styled-components';

import RankingContainer from '../../containers/main/RankingContainer';
import IframeContainer from '../../containers/main/IframeContainer';

const MainLayoutBlock = styled.div`
    height: 800px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const sideBlockStyle = css`
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 20%;
    align-items: center;
`;

const LeftSideBlock = styled.div`
    ${sideBlockStyle}
    margin-right: 1%;
`;

const RightSideBlock = styled.div`
    ${sideBlockStyle}
    margin-left: 1%;
`;

const MainLayout = () => {
    return (
        <MainLayoutBlock>
            <LeftSideBlock>
                <IframeContainer roomKey={0} />
                <IframeContainer roomKey={1} />
            </LeftSideBlock>
            <RankingContainer />
            <RightSideBlock>
                <IframeContainer roomKey={2} />
                <IframeContainer roomKey={3} />
            </RightSideBlock>
        </MainLayoutBlock>
    )
};

export default React.memo(MainLayout);