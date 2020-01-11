import React from 'react';
import { Helmet } from 'react-helmet-async';

import HeaderContainer from '../containers/common/HeaderContainer';
import CommunityLayoutContainer from '../containers/community/CommunityLayoutContainer';

const CommunityPage = () => {

    return (
        <>
            <Helmet>
                <title>Community • Chesssup.com</title>
            </Helmet>
            <HeaderContainer />
            <CommunityLayoutContainer />
        </>
    )
};

export default CommunityPage;