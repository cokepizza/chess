import React from 'react';
import styled, { css } from 'styled-components';

import RankingContainer from '../../containers/main/RankingContainer';
import IframeContainer from '../../containers/main/IframeContainer';

const MainLayoutBlock = styled.div`
    width: 100%;
    margin-top: 40px;
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

const MainLayout = () => {
    return (
        <MainLayoutBlock>
            <LeftSideBlock>
                <IframeContainer roomKey={0} />
            </LeftSideBlock>
            <RankingContainer />
            <RightSideBlock>

            </RightSideBlock>
        </MainLayoutBlock>
    )
};

export default React.memo(MainLayout);