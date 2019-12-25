import React from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ record, white, black }) => {

    if(!record) {
        return (
            <Timer />    
        )
    }

    if(white) {
        return (
            <Timer
              time={record.whiteTime}
            />
        )
    }

    if(black) {
        return (
            <Timer
              time={record.blackTime}
            />
        )
    }
    
};

export default TimerContainer;