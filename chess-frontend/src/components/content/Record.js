import React from 'react';
import styled from 'styled-components';
import TimerContainer from '../../containers/common/TimerContainer';
import PieceMoveListContainer from '../../containers/content/PieceMoveListContainer';

const RecordBlock = styled.div`
    width: 100%;
    height: 300px;
    background-color: white;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const NameBlock = styled.div`
    width: 100%;
    height: 30px;
    background-color: white;
`;

const Record = () => {
    return (
        <>
            <TimerContainer black />
            <RecordBlock>
                <NameBlock>
                </NameBlock>
                <PieceMoveListContainer />
                <NameBlock>
                </NameBlock>
            </RecordBlock>
            <TimerContainer white />
        </>
    )
};

export default React.memo(Record);