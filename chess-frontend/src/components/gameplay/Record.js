import React from 'react';
import styled from 'styled-components';

import TimerContainer from '../../containers/gameplay/TimerContainer';
import StatusContainer from '../../containers/gameplay/StatusContainer';
import PieceMoveListContainer from '../../containers/gameplay/PieceMoveListContainer';
import TimeLineContainer from '../../containers/gameplay/TimeLineContainer';
import UndoRedoContainer from '../../containers/gameplay/UndoRedoContainer';
import UtilContainer from '../../containers/gameplay/UtilContainer';

const RecordBlock = styled.div`
    position: relative;
    width: 100%;
    height: 360px;
    background-color: white;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Record = ({ reversal }) => {
    return (
        <>
            {reversal ? (
                <>
                    <TimerContainer white />
                </>
            ) : (
                <>
                    <TimerContainer black />
                </>
            )}
            <RecordBlock>
                {reversal ? (
                    <>
                        <TimeLineContainer white />
                        <StatusContainer white />
                    </>
                ) : (
                    <>
                        <TimeLineContainer black />
                        <StatusContainer black />
                    </>
                )}
                <UtilContainer />
                <PieceMoveListContainer />
                <UndoRedoContainer />
                {reversal ? (
                    <>
                        <StatusContainer black beneath/>
                        <TimeLineContainer black />
                    </>
                ) : (
                    <>
                        <StatusContainer white beneath/>
                        <TimeLineContainer white />
                    </>
                )}
                
            </RecordBlock>
            {reversal ? (
                <>
                    <TimerContainer black />
                </>
            ) : (
                <>
                    <TimerContainer white />
                </>
            )}
        </>
    )
};

export default React.memo(Record);