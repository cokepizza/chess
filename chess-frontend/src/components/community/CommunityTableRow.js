import React from 'react';
import styled from 'styled-components';

const CommunityTableRowBlock = styled.tr`
    width: 100%;
    height: 100px;
    &:nth-child(odd) {
        background: #F7F6F4;
    }
`;

const CommunityTableRow = ( {title, count, comments, time}) => {
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