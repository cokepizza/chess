import React from 'react';
import styled from 'styled-components';
import RankImage from '../../static/image/ranking.svg';
import ListContainer from '../../containers/main/ListContainer';

const RankingBlock = styled.div`
    position: relative;
    width: 720px;
    height: 720px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 30px;
    background-color: rgba(255,255,255,0.5);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const BackgroundBlock = styled.img`
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    opacity: 0.1;
    z-index: -1;
`;

const Ranking = ({ rank }) => {
    return (
        <RankingBlock>
            <BackgroundBlock src={RankImage}/>
            <ListContainer list={rank}/>
        </RankingBlock>
    )
};

export default React.memo(Ranking);