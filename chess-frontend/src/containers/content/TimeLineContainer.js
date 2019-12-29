import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeLine from '../../components/content/TimeLine';

const TimeLineContainer = ({ white, black }) => {
    const { whiteNick, blackNick, whiteTime, blackTime, participant } = useSelector(({ record, game }) => ({
        whiteTime: record.whiteTime,
        blackTime: record.blackTime,
        whiteNick: game.white,
        blackNick: game.black,
        participant: game.participant,
    }));

    const maximumTime = useRef(0.01);

    useEffect(() => {
        if(white) {
            maximumTime.current = Math.max(whiteTime, maximumTime.current);
        } else {
            maximumTime.current = Math.max(blackTime, maximumTime.current);
        }
    }, [white, whiteTime, blackTime]);

    const participantSet = new Set(participant);
    let remainTime = 0;

    if((white && participantSet.has(whiteNick)) || (black && participantSet.has(blackNick))) {
        remainTime = white ? (whiteTime / maximumTime.current) : (blackTime / maximumTime.current);
    }

    remainTime = Math.min(remainTime, 1);

    return (
        <TimeLine
            time={remainTime}
        />
    )
};

export default TimeLineContainer;