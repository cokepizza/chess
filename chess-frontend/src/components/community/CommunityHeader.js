import React from 'react';
import styled from 'styled-components';

const CommunityTableHeader = styled.div`
    display:flex;
    flex-direction: row;
    width: 100%;
    height: 30px;
    background-color: rgba(255, 255, 255);
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const CellBlock = styled.div`
    width: ${props => props.width ? props.width : "20%"};
    height: 50px; 
    text-align: center;
    font-size: 15px;
`;

const CommunityTableHeaderBlock = () => {
    return (
        <CommunityTableHeader>
            <CellBlock width={'70%'}>Title</CellBlock>
            <CellBlock width={"10%"}>View Counts</CellBlock>
            <CellBlock width={"10%"}>Comments</CellBlock>
            <CellBlock width={"10%"}>Post Time</CellBlock>
        </CommunityTableHeader>
    );
};

export default CommunityTableHeaderBlock;