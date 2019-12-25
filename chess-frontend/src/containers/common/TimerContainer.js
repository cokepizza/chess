import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ status, white, black }) => {
    const startTime = useRef(new Date().getTime());
    const targetTime = useRef();
    const timeoutRef = useRef();

    const [ time, setTime ] = useState();
    
    useEffect(() => {
        console.dir(status);
        if(status && status.start) {
            console.dir(status.start);
            if(white) {
                console.dir('white');
                if(status.turn % 2 === 0) {
                    targetTime.current = status.whiteTime;
                    setTime(targetTime.current);
                } else {
                    clearTimeout(timeoutRef.current);
                }
            }
            else if(black) {
                console.dir('black');
                if(status.turn % 2 === 1) {
                    targetTime.current = status.blackTime;
                    setTime(targetTime.current);
                } else {
                    clearTimeout(timeoutRef.current);
                }
            }
        }
    }, [status, white, black]);
    
    
    useEffect(() => {
        if(time) {
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