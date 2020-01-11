import React from 'react';
import { Helmet } from 'react-helmet-async';

import GameLayoutContainer from '../containers/game/GameLayoutContainer';
import HeaderContainer from '../containers/common/HeaderContainer';

const GamePage = () => {
    return (
        <>
            <Helmet>
                <title>Game • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <GameLayoutContainer />
        </>
    )
};

export default GamePage;