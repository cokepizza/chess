import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import HeaderContainer from '../containers/common/HeaderContainer';
import GamePlayLayoutContainer from '../containers/gameplay/GamePlayLayoutContainer';

const GamePlayPage = ({ history, match }) => {
    useEffect(() => {
        if(!match.params.id) {
            history.push('/');
        }
    }, [history, match]);

    if(!match.params.id) return null;
    const { id } = match.params;
    if(!id) return null;
    
    return (
        <>
            <Helmet>
                <title>GamePlay • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <GamePlayLayoutContainer gameKey={id}/>
        </>
    )
};

export default withRouter(GamePlayPage);