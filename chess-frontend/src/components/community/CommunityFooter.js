import React from 'react';
import styled, { css } from 'styled-components';

const CommunityTableFooter = styled.div`
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

const inputStyle = css`
    outline: none;
    border: none;
    height: 25px;
    width: 70%;
    padding-left: 5%;
    box-shadow :  0 3px 1px -2px rgba(0,0,0,0.2);
    `;

const SearchInputBlock = styled.input`
    ${inputStyle}
`

const CommunityTableFooterBlock = () => {
    return (
        <CommunityTableFooter>
            <CellBlock width={'70%'}><SearchInputBlock /></CellBlock>
            <CellBlock width={"30%"}>ETCS</CellBlock>
        </CommunityTableFooter>
    );
};

export default CommunityTableFooterBlock;