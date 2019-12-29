import React from 'react';
import styled from 'styled-components';

const TimeLineBlock = styled.div`
    position: absolute;
    height: 2px;

`;

const TimeLine = ({ time }) => {
    console.dir(time);
    return (
        <TimeLineBlock />
    )
};

export default TimeLine;