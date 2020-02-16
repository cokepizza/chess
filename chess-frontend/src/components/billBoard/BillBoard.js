import React from 'react';
import styled from 'styled-components';
import BillBoardCanvasWrapperContainer from '../../containers/billBoard/BillBoardCanvasWrapperContainer';

const BillBoardFrameBlock = styled.div`
    display: flex;
    flex-direction: column;
`;

const BillBoardBlock = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.3);
`;

const InformFrameBlock = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

const PlayerBlock = styled.div`
  display: flex;
`;

const TextBlock = styled.div`
  font-size: 12px;
`;

const BillBoard = ({ roomKey, inform }) => {
    return (
        <BillBoardFrameBlock>
            <BillBoardBlock>
                <BillBoardCanvasWrapperContainer roomKey={roomKey} />
            </BillBoardBlock>
            <InformFrameBlock>
                {inform && inform.map(player => (
                    <PlayerBlock key={roomKey + '_' + player.username}>
                        <TextBlock>{player.username}</TextBlock>
                        <TextBlock>{player.elo}</TextBlock>
                    </PlayerBlock>
                ))}
            </InformFrameBlock>
        </BillBoardFrameBlock>
    )
};

export default BillBoard;