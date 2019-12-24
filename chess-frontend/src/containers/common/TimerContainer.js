import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ status, white, black }) => {
    const ref = useRef(new Date().getTime());
    const targetTime = useRef();

    const [ time, setTime ] = useState();
    
    useEffect(() => {
        if(status) {
            if(white) {
                targetTime.current = status.whiteTime;
            }
            else if(black) {
                targetTime.current = status.blackTime;
            }   
            setTime(targetTime.current); 
        }
    }, [status, white, black]);
    
    
    useEffect(() => {
        if(time) {
            setTimeout(() => {
                setTime(targetTime.current - (new Date().getTime() - ref.current));
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