import React from 'react';
import styled from 'styled-components';
import BillBoardCanvasWrapperContainer from '../../containers/main/BillBoardCanvasWrapperContainer';

const BillBoardFrameBlock = styled.div`
    /* display: flex;
    width: 216px;
    height: 280px; */
    /* flex-direction: column; */
    justify-content: flex-start;
    align-items: center;

    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    background: rgba(255,255,255,0.5);
    width: 236px;
    height: 300px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    z-index: -10;
`;

const BillBoardBlock = styled.div`
    width: 216px;
    height: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.3);
`;

const InformFrameBlock = styled.div`
    margin-top: 4px;
    height: 60px;
    width: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PlayerBlock = styled.div`
    height: 40px;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);

    & + & {
        margin-left: 12px;
    }
`;

const TextBlock = styled.div`
  font-size: 10px;
`;

const BillBoard = ({ roomKey, inform }) => {
    return (
        <BillBoardFrameBlock>
            <BillBoardBlock>
                <BillBoardCanvasWrapperContainer roomKey={roomKey} />
            </BillBoardBlock>
            <InformFrameBlock>
                {inform && inform.map((player, index) => (
                    <PlayerBlock key={roomKey + '_' + index + '_' + player.username}>
                        <TextBlock>{player.username.split('@')[0]}</TextBlock>
                        <TextBlock>{player.elo}</TextBlock>
                    </PlayerBlock>
                ))}
            </InformFrameBlock>
        </BillBoardFrameBlock>
    )
};

export default BillBoard;