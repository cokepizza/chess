import React from 'react';
import styled, { css } from 'styled-components';

const TimeLineBlock = styled.div`
    position: absolute;
    height: 2px;
    width: 100%;
    background-color: green;
    ${props => props.time && css`
        width: ${props.time} + '%';
    `}
`;

const TimeLine = ({ time }) => {
    console.dir(time);
    return (
        <TimeLineBlock time={time}/>
    )
};

export default React.memo(TimeLine);