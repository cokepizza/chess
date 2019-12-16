import React from 'react';
import { withRouter } from 'react-router-dom';
import HeaderContainer from '../containers/common/HeaderContainer';
import GameLayoutContainer from '../containers/common/GameLayoutContainer';

const GamePage = ({ history }) => {
    const { key } = history.location.state;
    
    return (
        <>
            <HeaderContainer />
            <GameLayoutContainer gameKey={key}/>
        </>
    )
};

export default withRouter(GamePage);