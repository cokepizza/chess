import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Ranking from '../../components/main/Ranking';

const tombIndex = 15;
const RankingContainer = () => {
    const { ranking } = useSelector(({ ranking }) => ({
        ranking: ranking.ranking,
    }));

    const [ rank, setRank ] = useState();

    useEffect(() => {
        if(ranking) {
            setRank(prevState => {
                //  initialize
                if(!prevState) {
                    return ranking
                        .map((ranking, index) => ({
                            ...ranking,
                            index,
                        }));
                }

                //  delete thumbIndex && update component state
                const stable = [];
                const revisedState = prevState
                    .filter(cell => cell.index !== tombIndex)
                    .map(internalCell => {
                        const index = ranking.findIndex(externalCell => externalCell.username === internalCell.username);
                        if(index >= 0) {
                            stable.push(index);
                            // eslint-disable-next-line
                            if(JSON.stringify({ ...ranking[index], index }) == JSON.stringify(internalCell)) {
                                return internalCell;
                            }
                            return {
                                ...ranking[index],
                                index,
                            }
                        } else {
                            return {
                                ...internalCell,
                                index: tombIndex,
                            }
                        }
                  });

                //  update new ranker (tombIndex index => target index)
                let init = 0;
                const newlyPushed = [];
                stable
                    .sort((a, b) => a - b)
                    .reduce((acc, cur) => {
                        for(let i=init; i<cur; ++i) {
                            acc.push(i);
                        }
                        init = cur + 1;
                        return acc;
                    }, [])
                    .forEach(index => {
                        revisedState.push({
                            ...ranking[index],
                            index: tombIndex,
                        })
                        newlyPushed.push({
                            ...ranking[index],
                            index,
                        })
                    });
                
                if(stable.length > 0) {
                    setTimeout(() => {
                        setRank(prevState => {
                            const copiedRanking = [ ...prevState ];
                            newlyPushed.forEach(externalCell => {
                                const index = copiedRanking.findIndex(internalCell => internalCell.username === externalCell.username);
                                if(index) {
                                    copiedRanking.splice(index, 1, {
                                        ...externalCell
                                    });
                                }
                            });
    
                            return copiedRanking;
                        })
                    }, 0);
                }
                
                return revisedState;
            });
        }
    }, [ranking]);

    useEffect(() => {
        return () => {
            setRank(null);
        };
    }, []);

    return (
        <Ranking rank={rank}/>
    )
};

export default RankingContainer;