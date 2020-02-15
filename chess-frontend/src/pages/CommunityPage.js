import React from 'react';
import { Helmet } from 'react-helmet-async';

import HeaderContainer from '../containers/common/HeaderContainer';
import CommunityLayoutContainer from '../containers/community/CommunityLayoutContainer';
import FooterContainer from '../containers/common/FooterContainer';

const CommunityPage = () => {

    return (
        <>
            <Helmet>
                <title>Community • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <CommunityLayoutContainer />
            <FooterContainer />
        </>
    )
};

export default CommunityPage;