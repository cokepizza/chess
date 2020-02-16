import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TimeLine from '../../components/gameplay/TimeLine';

const TimeLineContainer = ({ white, black, init }) => {
    const { whiteRatio, blackRatio, whiteNick, blackNick, participant } = useSelector(({ record, game }) => ({
        whiteRatio: record.whiteRatio,
        blackRatio: record.blackRatio,
        whiteNick: game.white,
        blackNick: game.black,
        participant: game.participant,
    }));

    const [time, setTime] = useState(0);

    //  default 0으로 초기 렌더링을 진행한 후 redux 값이 들어왔을 때 리렌더링 하는 방식
    //  init 이후에만 리렌더링해야 css효과를 입힐 수 있음
    useEffect(() => {
        const participantSet = new Set(participant);
        if((init && white && participantSet.has(whiteNick)) || (init && black && participantSet.has(blackNick))) {
            let nextTime = white ? whiteRatio : blackRatio;
            nextTime = Math.min(nextTime, 1);
            setTime(nextTime);
        } else {
            setTime(0);
        }
    }, [init, white, black, whiteNick, blackNick, whiteRatio, blackRatio, participant]);

    //  role값이 들어온 다음에는 다른 redux값이 들어온 경우도 있어 timeline bar가 완성된 상태로 렌더링 되버림
    // let time = 0;
    // if((white && participantSet.has(whiteNick)) || (black && participantSet.has(blackNick))) {
    //     time = white ? whiteRatio : blackRatio;
    // }
    // time = Math.min(time, 1);

    return (
        <TimeLine
            time={time}
        />
    )    
};

export default TimeLineContainer;