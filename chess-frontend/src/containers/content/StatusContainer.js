import React from 'react';
import { useSelector } from 'react-redux';
import Status from '../../components/content/Status';

const StatusContainer = ({ black, white }) => {
    const { blackNick, whiteNick, participant } = useSelector(({ game }) => ({
        blackNick: game.black,
        whiteNick: game.white,
        participant: game.participant,
    }));

    const participantSet = new Set(participant);
    const light = (white && participantSet.has(whiteNick)) || (black && participantSet.has(blackNick));
    const name = (white && whiteNick) || (black && blackNick);

    return (
        <Status
            light={light}
            name={name}
        />
    )
};

export default StatusContainer;