import React from 'react';
import styled from 'styled-components';

const FixSizeBlock = styled.div`
    width: 1680px;
`;

const FixSize = props => {
    return (
        <FixSizeBlock {...props} />
    )
};

export default FixSize;