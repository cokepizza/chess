import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimeLine from '../../components/content/TimeLine';
import { clearValue } from '../../modules/record';

const TimeLineContainer = ({ white, black }) => {
    const { whiteRatio, blackRatio, whiteNick, blackNick, participant } = useSelector(({ record, game }) => ({
        whiteRatio: record.whiteRatio,
        blackRatio: record.blackRatio,
        whiteNick: game.white,
        blackNick: game.black,
        participant: game.participant,
    }));
    
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch]);

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