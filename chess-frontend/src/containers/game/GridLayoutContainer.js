import React from 'react';
import { useSelector } from 'react-redux';

import GridLayout from '../../components/game/GridLayout';

const GridLayoutContainer = () => {
    const { games } = useSelector(({ games }) => ({
        games: games.games,
    }));

    return (
        <GridLayout games={games} />
    )
};

export default GridLayoutContainer;