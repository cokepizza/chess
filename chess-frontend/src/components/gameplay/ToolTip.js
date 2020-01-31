import React from 'react';
import styled from 'styled-components';

const ToolTipBlock = styled.div`
    position: absolute;
    height: 150px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ToolTip = () => {
    return (
        <ToolTipBlock />
    )
};

export default ToolTip;