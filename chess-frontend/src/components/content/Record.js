import React from 'react';
import styled from 'styled-components';

const RecordBlock = styled.div`
    position: relative;
    border: 1px solid black;
    background-color: blue;
    height: 50%;
`;



const Record = () => {
    return (
        <RecordBlock>
            Record
        </RecordBlock>
    );
};

export default React.memo(Record);