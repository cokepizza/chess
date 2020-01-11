import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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
            <HeaderContainer />
            <GamePlayLayoutContainer gameId={id}/>
        </>
    )
};

export default withRouter(GamePlayPage);