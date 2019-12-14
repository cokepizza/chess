import React from 'react';
import styled from 'styled-components';

const GridLayoutBlock = styled.div`
    display: flex;
    width: 100%;
    height: 90%;
    background-color: gray;

`;

const GridLayout = () => {
    return (
        <GridLayoutBlock />
    )
};

export default React.memo(GridLayout);