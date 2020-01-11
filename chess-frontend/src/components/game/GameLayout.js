import React from 'react';
import styled from 'styled-components';

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

const GameLayout = () => {
    return (
        <>
            <GameLayoutBlock>
                <SummaryContainer />
                <GridLayoutContainer />
                <CreationContainer />
            </GameLayoutBlock>          
        </>
    )
};

export default React.memo(GameLayout);