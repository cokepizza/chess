import React, { useRef, useEffect } from 'react';
import Time from './Time';
import styled from 'styled-components';

const RecordFrameBlock = styled.div`
    margin: 10px 10px 10px 10px;
    border : 3px groove gray;
    border-style: outset;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    width: 450px;
    box-shadow: 5px 5px 5px;
    display: flex;
    flex-direction: column;
`;

const RecordBlock = styled.div`
    border: 1px solid black;
    background-color: white;
    height: 80%;
    overflow-y: auto;
`;

const RecordItem = styled.div`
    padding: 0.3rem;
    display: flex;
    &:nth-child(even) {
        background: #f2f3f4;
    }
    & + & {
        border-top: 1px solid #dee2e6;
    }
`;

const Record = ( ) => {
    const ref = useRef();
    const records = [ '1. e4 h5', '2. g4 e5', '3. h4 f6', '4. Rh3 d5', '5. Ke2 hxg4', '6. Nf3 Qd7', '7. Ke2 Qb6', '8. Qa4 c5'];
    
    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [records]);

    return (
        <>

            <RecordFrameBlock>
                <Time/>
                <RecordBlock ref={ref}>
                    {records.map(record => (
                        <RecordItem>{record}</RecordItem>
                    ))}
                </RecordBlock>
            </RecordFrameBlock>
        </>
    );
};

export default React.memo(Record);