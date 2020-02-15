import React from 'react';
import { Helmet } from 'react-helmet-async';

import HeaderContainer from '../containers/common/HeaderContainer';
import RegisterContainer from '../containers/auth/RegisterContainer';
import FooterContainer from '../containers/common/FooterContainer';

const RegisterPage = () => {

    return (
        <>
            <Helmet>
                <title>Sign Up • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <RegisterContainer />
            <FooterContainer />
        </>
    )
};

export default RegisterPage;