import React from 'react';
import styled, { css } from 'styled-components';

import GridLayoutContainer from '../../containers/game/GridLayoutContainer';
import SummaryContainer from '../../containers/game/SummaryContainer';
import CreationContainer from '../../containers/game/CreationContainer';

const GameLayoutBlock = styled.div`
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

const GameLayout = () => {
    return (
        <>
            <GameLayoutBlock>
                <LeftSideBlock>
                    <SummaryContainer />
                </LeftSideBlock>
                <GridLayoutContainer />
                <RightSideBlock>
                    <CreationContainer />
                </RightSideBlock>
            </GameLayoutBlock>          
        </>
    )
};

export default React.memo(GameLayout);