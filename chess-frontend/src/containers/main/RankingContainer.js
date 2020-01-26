import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Ranking from '../../components/main/Ranking';

const RankingContainer = () => {
    const { ranking } = useSelector(({ ranking }) => ({
        ranking: ranking.ranking,
    }));

    const [ rank, setRank ] = useState();

    useEffect(() => {
        if(ranking) {
            setRank(prevState => {
                console.dir(prevState);
                if(!prevState) {
                    return ranking
                        .map((ranking, index) => ({
                            ...ranking,
                            index,
                        }));
                }

                const revisedState = prevState.map(internalCell => {
                    const index = ranking.findIndex(externalCell => externalCell.username === internalCell.username);
                    if(index >= 0) {
                        if(JSON.stringify(ranking[index]) == JSON.stringify(internalCell)) {
                            return internalCell;
                        }
                        return {
                            ...ranking[index],
                            index,
                        }
                    } else {
                        return {
                            ...internalCell,
                            index: 10,
                        }
                    }
                });

                return revisedState;
            });

            setTimeout(() => {
                const copiedRanking = JSON.parse(JSON.stringify(ranking));
                // copiedRanking.reverse();
                const wait = copiedRanking[0];
                copiedRanking[0] = copiedRanking[5];
                copiedRanking[5] = wait;


                setRank(prevState => {
                    console.dir(prevState);
                    if(!prevState) {
                        return ranking
                            .map((ranking, index) => ({
                                ...ranking,
                                index,
                            }));
                    }
    
                    const revisedState = prevState.map(internalCell => {
                        const index = copiedRanking.findIndex(externalCell => externalCell.username === internalCell.username);
                        if(index >= 0) {
                            if(JSON.stringify(copiedRanking[index]) == JSON.stringify(internalCell)) {
                                return internalCell;
                            }
                            return {
                                ...copiedRanking[index],
                                index,
                            }
                        } else {
                            return {
                                ...internalCell,
                                index: 10,
                            }
                        }
                    });
    
                    return revisedState;
                });

            }, 1000);
        }
    }, [ranking]);

    return (
        <Ranking rank={rank}/>
    )
};

export default RankingContainer;