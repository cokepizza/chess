import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeLine from '../../components/content/TimeLine';

const TimeLineContainer = ({ white, black }) => {
    const { whiteTime, blackTime } = useSelector(({ record, game }) => ({
        whiteTime: record.whiteTime,
        blackTime: record.blackTime,
        defaultTime: game.defaultTime,
    }));

    const [ time, setTime ] = useState();
    const maximumTime = useRef(0.01);

    useEffect(() => {
        if(white) {
            maximumTime.current = Math.max(whiteTime, maximumTime.current);
        } else {
            maximumTime.current = Math.max(blackTime, maximumTime.current);
        }
    }, [white, whiteTime, blackTime]);

    useEffect(() => {
        if(white) {
            setTime(whiteTime / maximumTime.current);
        } else {
            setTime(blackTime / maximumTime.current);
        }
    }, [white, whiteTime, blackTime]);

    // const remainTime = white ? (whiteTime / maximumTime.current) : (blackTime / maximumTime.current);

    return (
        <TimeLine
            time={time}
        />
    )
};

export default TimeLineContainer;