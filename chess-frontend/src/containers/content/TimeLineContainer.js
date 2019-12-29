import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeLine from '../../components/content/TimeLine';

const TimeLineContainer = ({ white, black }) => {
    const { whiteTime, blackTime } = useSelector(({ record, game }) => ({
        whiteTime: record.whiteTime,
        blackTime: record.blackTime,
        defaultTime: game.defaultTime,
    }));

    const maximumTime = useRef(0);
    const [ time, setTime ] = useState();

    useEffect(() => {
        if(white) {
            maximumTime.current = Math.max(whiteTime, maximumTime.current);
            console.dir(whiteTime);
        } else {
            maximumTime.current = Math.max(blackTime, maximumTime.current);
            console.dir(blackTime);
        }
    }, [white, whiteTime, blackTime]);

    useEffect(() => {
        if(white) {
            setTime(whiteTime / maximumTime.current);
        } else {
            setTime(blackTime / maximumTime.current);
        }   
    });
    // const xtime = white ? (whiteTime / maximumTime.current) : (blackTime / maximumTime.current);
    const xtime = white ? whiteTime : blackTime;
    // console.dir(maximumTime.current);

    return (
        <TimeLine
            time={xtime}

        />
    )
};

export default TimeLineContainer;