import React from 'react';
import styled from 'styled-components';
import BillBoardCanvasWrapperContainer from '../../containers/billBoard/BillBoardCanvasWrapperContainer';

const BillBoardBlock = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.4);
`;

const BillBoard = ({ roomKey }) => {
    return (
        <BillBoardBlock>
            <BillBoardCanvasWrapperContainer roomKey={roomKey} />
        </BillBoardBlock>
    )
};

export default BillBoard;