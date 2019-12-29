import React from 'react';
import styled, { css } from 'styled-components';

const TimeLineBlock = styled.div`
    position: absolute;
    height: 2px;
    background-color: green;
    transition-duration: 1s;
    transition-timing-function: linear;

    width: ${props => (props.time * 100) + '%'};
    ${props => props.time <= 0.1 && css`
        background-color: red;
    `}
`;

const TimeLine = ({ time }) => {
    return (
        <TimeLineBlock time={time}/>
    )
};

export default React.memo(TimeLine);