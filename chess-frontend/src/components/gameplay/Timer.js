import React from 'react';
import styled, { css } from 'styled-components';

const TimerBlock = styled.div`
    width: 50%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    background-color: white;
    ${props => props.color && css`
        background-color: rgb(208, 224, 189);
    `}
    ${props => props.time <= 10000 && css`
        background-color: rgb(230, 153, 153);
    `}
`;

const TimeSliceBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 47%;
    color: black;
    font-size: 50px;
`;

const ColonBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    width: 6%;
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

const Timer = ({ time, color }) => {
    
    const minute = Math.floor(time / 60000);
    const second = Math.floor((time % 60000) / 1000);

    // eslint-disable-next-line
    if(time == undefined || time === null) {
        return <TimerBlock />
    }

    return (
        <TimerBlock
            time={time}
            color={color ? 1 : 0}
        >
            <TimeSliceBlock>
                {timeConverter(minute)}
            </TimeSliceBlock>
            <ColonBlock>
                :
            </ColonBlock>
            <TimeSliceBlock>
                {timeConverter(second)}
            </TimeSliceBlock>
        </TimerBlock>
    )
}

export default Timer;
