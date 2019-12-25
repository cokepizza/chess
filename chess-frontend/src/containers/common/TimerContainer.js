import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ status, white, black }) => {
    const startTime = useRef();
    const targetTime = useRef();
    const timeoutRef = useRef();
    const stopTime = useRef();

    const [ time, setTime ] = useState();
    
    useEffect(() => {
        console.dir(status);
        if(status && status.start) {
            console.dir(status.start);
            if(white) {
                console.dir('white');
                if(status.turn % 2 === 0) {
                    targetTime.current = status.whiteTime;
                    startTime.current = new Date().getTime();
                    setTime(targetTime.current);
                    stopTime.current = false;
                } else {
                    stopTime.current = true;
                }
            }
            else if(black) {
                console.dir('black');
                if(status.turn % 2 === 1) {
                    targetTime.current = status.blackTime;
                    startTime.current = new Date().getTime();
                    setTime(targetTime.current);
                    stopTime.current = false;
                } else {
                    stopTime.current = true;
                }
            }
        }
    }, [status, white, black]);
    
    
    useEffect(() => {
        if(time && !stopTime.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                const calculatedTime = targetTime.current - (new Date().getTime() - startTime.current);
                if(calculatedTime >= 0) {
                    setTime(calculatedTime);
                } else {
                    setTime(0);
                }
            }, 10);
        }
    }, [time]);

    return (
        <Timer
            time={time}
        />
    )
}

export default TimerContainer;