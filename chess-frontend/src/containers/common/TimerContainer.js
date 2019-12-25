import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ status, white, black }) => {
    const startTime = useRef();
    const targetTime = useRef();
    const timeoutRef = useRef();
    const lockTime = useRef();
    const currentTime = useRef(0);

    const [ time, setTime ] = useState();
    
    useEffect(() => {
        if(status && status.start) {
            if(white) {
                if(status.turn % 2 === 0) {
                    targetTime.current = currentTime.current + status.whiteTime;
                    startTime.current = new Date().getTime();
                    setTime(targetTime.current);
                    lockTime.current = true;
                } else {
                    lockTime.current = false;
                }
            }
            else if(black) {
                if(status.turn % 2 === 1) {
                    targetTime.current = currentTime.current + status.blackTime;
                    startTime.current = new Date().getTime();
                    setTime(targetTime.current);
                    lockTime.current = true;
                } else {
                    lockTime.current = false;
                }
            }
        }
    }, [status, white, black]);
    
    
    useEffect(() => {
        if(time && lockTime.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                const calculatedTime = targetTime.current - (new Date().getTime() - startTime.current);
                if(calculatedTime >= 0) {
                    currentTime.current = calculatedTime;
                    setTime(calculatedTime);
                } else {
                    currentTime.current = 0;
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