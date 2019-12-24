import React from 'react';
import styled from 'styled-components';

const TimerBlock = styled.div`
    width: 50%;
    height: 60px;
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
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
    
    if(!time) {
        return <TimerBlock />
    }

    console.dir(second + ' : ' + millisecond);
    // console.dir(time);
    return (
        <TimerBlock>
            {timeConverter(second)} : {timeConverter(millisecond)}
        </TimerBlock>
    )
}

export default Timer;
