import React from 'react';
import { useSelector } from 'react-redux';
import Ranking from '../../components/main/Ranking';

const RankingContainer = () => {
    const { ranking } = useSelector(({ ranking }) => ({
        ranking: ranking.ranking,
    }));

    return (
        <Ranking ranking={ranking}/>
    )
};

export default RankingContainer;