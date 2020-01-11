import React from 'react';
import { Helmet } from 'react-helmet-async';

import HeaderContainer from '../containers/common/HeaderContainer';
import LoginContainer from '../containers/auth/LoginContainer';

const LoginPage = () => {
    return (
        <>
            <Helmet>
                <title>Sign In • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <LoginContainer />
        </>
    )
};

export default LoginPage;