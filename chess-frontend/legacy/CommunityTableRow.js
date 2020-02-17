import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const CommunityTableRowBlock = styled.div`
    display:flex;
    flex-direction: row;
    justify-content:center;
    width: 100%;
    transition-duration:0.1s;
    &:nth-child(odd) {
        background: #F7F6F4;
    }
    &:hover {
            background: #add8e6;
            cursor:pointer;
        }
`;

const CellBlock = styled.div`
    width: ${props => props.width ? props.width : "20%"};
    height: 50px; 
    display:flex;
    justify-content:center;
    align-items:center;
    font-size: 15px;
`;

const CellTextBlock = styled.div`
    text-align: center;
    height : 1em;
    width : 100%;
`;

const CommunityTableRow = ({ history, title, count, comments, time }) => {
    return (
        <CommunityTableRowBlock onClick={() => {
            history.push('/Contents')
        }}>
            <CellBlock width={"70%"}><CellTextBlock>{title}</CellTextBlock></CellBlock>
            <CellBlock width={"10%"}><CellTextBlock>{count}</CellTextBlock></CellBlock>
            <CellBlock width={"10%"}><CellTextBlock>{comments}</CellTextBlock></CellBlock>
            <CellBlock width={"10%"}><CellTextBlock>{time}</CellTextBlock></CellBlock>
        </CommunityTableRowBlock>
    );
};

export default withRouter(CommunityTableRow);