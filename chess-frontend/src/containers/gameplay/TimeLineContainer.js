import React from 'react';
import { useSelector } from 'react-redux';
import TimeLine from '../../components/gameplay/TimeLine';

const TimeLineContainer = ({ white, black }) => {
    const { whiteRatio, blackRatio, whiteNick, blackNick, participant } = useSelector(({ record, game }) => ({
        whiteRatio: record.whiteRatio,
        blackRatio: record.blackRatio,
        whiteNick: game.white,
        blackNick: game.black,
        participant: game.participant,
    }));

    const participantSet = new Set(participant);
    let time = 0;

    if((white && participantSet.has(whiteNick)) || (black && participantSet.has(blackNick))) {
        time = white ? whiteRatio : blackRatio;
    }
 
    time = Math.min(time, 1);

    return (
        <TimeLine
            time={time}
        />
    )
};

export default TimeLineContainer;