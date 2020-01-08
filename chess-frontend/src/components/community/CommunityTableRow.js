import React from 'react';
import styled from 'styled-components';

const CommunityTableRowBlock = styled.tr`
    width: 100%;
    height: 100px;
    transition-duration: 0.2s;
    &:nth-child(odd) {
        background: #F7F6F4;
    }
    &:hover {
        box-shadow: 0 0 5px 5px #ADD8E6;
        background: #ADD8E6;
        &:active {
            box-shadow: 0 0 10px 10px #ADD8E6;
        }
    }  
`;

const CommunityTableRow = ({ title, count, comments, time }) => {
    return (
        <CommunityTableRowBlock>
            <td>{title}</td>
            <td>{count}</td>
            <td>{comments}</td>
            <td>{time}</td>
        </CommunityTableRowBlock>
    );
};

export default CommunityTableRow;