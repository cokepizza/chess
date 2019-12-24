import React from 'react';
import styled from 'styled-components';

const TimeBlock = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: row;
`;

const yourTime = 110;
const myTime = 120;

const TimeCellBlock = styled.div`
    width: 50%;
    border: 2px groove gray;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    background-color: ${props => props.color || 'gray'};
`;

const Time = () => {
    return (
        <TimeBlock>
            <TimeCellBlock color={'lightcoral'}>{yourTime}</TimeCellBlock>
            <TimeCellBlock color={'aqua'}>{myTime}</TimeCellBlock>
        </TimeBlock>
    );
};

export default Time;