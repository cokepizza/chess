import React from 'react';
import { useSelector } from 'react-redux';
import Timer from '../../components/gameplay/Timer';

const TimerContainer = ({ white, init }) => {

    const { whiteTime, blackTime, start, order } = useSelector(({ record, game }) => ({
        whiteTime: record.whiteTime,
        blackTime: record.blackTime,
        start: game.start,
        order: game.order,
    }));

    const time = white ? whiteTime : blackTime;
    const color = white ? (start && order === 'white') : (start && order === 'black');

    if(init) {
        return (
            <Timer
                time={time}
                color={color}
            />
        )
    } else {
        return (
            <Timer />
        )
    }
    
};

export default TimerContainer;