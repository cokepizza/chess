import React from 'react';
import styled from 'styled-components';

const HeaderBlock = styled.div`
    width: 100%;
    height: 50px;
    background-color: red;
`;

const Header = props => {
    return (
        <HeaderBlock {...props} />
    )
};

export default React.memo(Header);