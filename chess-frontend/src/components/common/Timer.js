import React from 'react';
import styled from 'styled-components';

const TimerBlock = styled.div`
    width: 50%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const TimeSliceBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 45%;
    color: black;
    font-size: 50px;
`;

const ColonBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 80%;
    width: 10%;
    color: black;
    opacity: 0.5;
    font-size: 50px;
`;

const timeConverter = timeSlice => {
    let convertedTime = '';
    convertedTime += String(Math.floor(timeSlice / 10));
    convertedTime += String(Math.floor(timeSlice % 10));
    return convertedTime;
}

const Timer = ({ time }) => {
    
    const second = Math.floor(time / 1000);
    const millisecond = Math.floor((time % 1000) / 10);

    // eslint-disable-next-line
    if(time == undefined || time === null) {
        return <TimerBlock />
    }

    return (
        <TimerBlock>
            <TimeSliceBlock>
                {timeConverter(second)}
            </TimeSliceBlock>
            <ColonBlock>
                :
            </ColonBlock>
            <TimeSliceBlock>
                {timeConverter(millisecond)}
            </TimeSliceBlock>
        </TimerBlock>
    )
}

export default Timer;
