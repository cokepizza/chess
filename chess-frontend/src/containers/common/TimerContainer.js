import React from 'react';
import Timer from '../../components/common/Timer';

const TimerContainer = ({ record, game, white, black }) => {

    if(!record) {
        return (
            <Timer />    
        )
    }

    if(white) {
        const color = game.start && game.order === 'white';
        return (
            <Timer
              time={record.whiteTime}
              color={color}
            />
        )
    }

    if(black) {
        const color = game.start && game.order === 'black';
        return (
            <Timer
              time={record.blackTime}
              color={color}
            />
        )
    }
    
};

export default TimerContainer;