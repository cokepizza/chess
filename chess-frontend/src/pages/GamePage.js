import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import HeaderContainer from '../containers/common/HeaderContainer';
import GameLayoutContainer from '../containers/common/GameLayoutContainer';

const GamePage = ({ history }) => {
    useEffect(() => {
        if(!history.location.state || !history.location.state.key) {
            history.push('/');
        }
    }, [history]);

    if(!history.location.state) return null;
    const { key } = history.location.state;
    if(!key) return null;
    
    return (
        <>
            <HeaderContainer />
            <GameLayoutContainer gameKey={key}/>
        </>
    )
};

export default withRouter(GamePage);