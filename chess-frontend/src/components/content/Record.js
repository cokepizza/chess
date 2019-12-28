import React from 'react';
import styled from 'styled-components';
import TimerContainer from '../../containers/content/TimerContainer';
import StatusContainer from '../../containers/content/StatusContainer';
import PieceMoveListContainer from '../../containers/content/PieceMoveListContainer';

const RecordBlock = styled.div`
    width: 100%;
    height: 360px;
    background-color: white;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const MenuBarBlock = styled.div`
    width: 100%;
    height: 30px;
    background-color: rgb(247, 246, 245);
`;

const Record = () => {
    return (
        <>
            <TimerContainer black />
            <RecordBlock>
                <StatusContainer black />
                <MenuBarBlock />
                <PieceMoveListContainer />
                <MenuBarBlock />
                <StatusContainer white />
            </RecordBlock>
            <TimerContainer white />
        </>
    )
};

export default React.memo(Record);